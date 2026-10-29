#!/usr/bin/env python3
"""Verify jazz composition evolution, default Hero tone and both historical recipe generations.

Examples:
  python music/endless/py/check_jazz_evolution.py --bank music/endless/bank/jazz
  python music/endless/py/check_jazz_evolution.py --mirror /tmp/mirror --matched-dir /tmp/round2

Read-only. The default archive is the shipped repo.zip. Historical bank recipes
are read directly from local git objects; no network or external audio is needed.
"""
import argparse, copy, gzip, hashlib, json, math, os, subprocess, sys, tempfile, zipfile
from collections import Counter, deque
from pathlib import Path
from check_release import real_sample_covers, sample_zones

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
WEB=HERE.parent


def require(condition, message):
    if not condition: raise RuntimeError(message)


def historical(ref, path):
    return subprocess.check_output(['git','-C',str(ROOT),'show',f'{ref}:{path}'])


def init(mirror):
    os.environ.update(AGENTSOUND_WEB_REPO=str(mirror),AGENTSOUND_ASSETS=str(mirror/'assets'),
                      AGENTSOUND_SAMPLES=str(mirror/'assets/samples'))
    sys.path.insert(0,str(mirror))
    import compose_web
    return compose_web


def check_piece(out, reference_fx=None):
    doc=json.loads(out['render']);info=out['info'];label=out['hash']
    require(hashlib.sha1(out['render'].encode()).hexdigest()[:16]==label,f'{label}: wrong render hash')
    require(out['recipe']['slot'].get('quartet')=='quartet-3',f'{label}: new composition not pinned')
    require(out['recipe']['slot'].get('sax_sound')=='hero-default-1',f'{label}: default sax not pinned')
    require(not info.get('web_missing'),f'{label}: missing tables')
    tracks={t['id']:t for t in doc['tracks']}
    require(set(tracks)=={'comp','piano','bass','drums','sax'},f'{label}: missing role')
    require(abs(info['seconds']-doc['lengthBeats']*60/doc['tempo'])<.02,f'{label}: duration disagrees')
    spans=doc['sections'];require(bool(spans),f'{label}: no sections')
    require(abs(spans[0]['startBeat'])<1e-6,f'{label}: opening does not start at zero')
    for a,b in zip(spans,spans[1:]):
        require(abs(a['endBeat']-b['startBeat'])<1e-5,f'{label}: section gap/overlap')
    require(abs(spans[-1]['endBeat']-doc['lengthBeats'])<1e-5,f'{label}: end disagrees')
    ranges={}; max_overlap=0; peak_attacks=0
    for tid,t in tracks.items():
        ns=t['notes'];require(bool(ns),f'{label}: empty {tid}')
        for n in ns:
            require(all(isinstance(x,(int,float)) and math.isfinite(x) for x in n[:4]),f'{label}: invalid {tid} note')
            require(n[0]>=0 and n[1]>0 and 0<=n[2]<=127 and 1<=n[3]<=127,f'{label}: invalid {tid} event')
            require(n[0]+n[1]<=doc['lengthBeats']+.1,f'{label}: {tid} note exceeds ending')
            require(real_sample_covers(t['instrument'],n[2],n[3]),f'{label}: unsampled {tid} note {n}')
        ranges[tid]=[min(n[2] for n in ns),max(n[2] for n in ns)]
        if tid=='sax':
            ordered=sorted(ns)
            max_overlap=max((min(a[0]+a[1]-b[0],b[1]) for a,b in zip(ordered,ordered[1:])),default=0)
            require(max_overlap<=.08,f'{label}: sustained polyphonic sax overlap {max_overlap}')
            recent=deque()
            for note in ordered:
                second=note[0]*60/doc['tempo'];recent.append(second)
                while recent and second-recent[0]>=1:recent.popleft()
                peak_attacks=max(peak_attacks,len(recent))
            require(peak_attacks<=12,f'{label}: sax phrase compressed into {peak_attacks} attacks/second')
            if reference_fx is not None:
                require(t['fx']==reference_fx,f'{label}: default Hero FX changed')
            require(t['sends']=={'hero_plate_70s':-14.0,'echo':-24.0},f'{label}: default Hero sends changed')
        for z in sample_zones(t['instrument']):
            file=z['file']
            if file.startswith('samples/splendid-grand-piano/'):
                group=info['piano'];name=Path(file).stem.replace(' ','_').replace('#','s')+'.opus'
            else:
                require(file in JAZZ,f'{label}: missing jazz mapping {file}')
                group='jazz';name=JAZZ[file][0]+'.opus'
            require(name in HASH[group] and (WEB/'samples'/group/name).is_file(),f'{label}: unavailable sample {group}/{name}')
    # Only explicitly resolved phrases have this requirement. Open handovers and
    # jazz extensions elsewhere are intentional possibilities, not errors.
    from agentsound.theory import chord
    resolved=0
    for section in out.get('tune',{}).get('performance',[]):
        for phrase in section.get('phrasing',[]):
            if phrase['action'] not in ('depart-resolve','rise','space','answer') or not phrase['notes']:continue
            last=phrase['notes'][-1];at=phrase['at']+last[0];pos=0;symbol=None
            for ch,dur in section['changes']:
                if pos<=at<pos+dur:symbol=ch;break
                pos+=dur
            require(symbol is not None,f'{label}: phrase outside chart')
            require(last[2]%12 in chord(symbol).pcs,f'{label}: unresolved authored cadence in {section["name"]}')
            resolved+=1
    return dict(hash=label,feel=info['feel'],seconds=info['seconds'],ranges=ranges,
                sax_max_overlap=round(max_overlap,6),sax_peak_attacks_per_second=peak_attacks,resolved_phrases=resolved)


def check_monophonic_projection():
    """Regression: a piano sustain crossing the next melody attack is not a sax chord."""
    from agentsound import Clip
    from jazz_web import sax_line
    source=Clip([(19,3,69,99),(20,3,72,101)],length=32)
    result=list(sax_line(source))
    require([(n.start,n.pitch,n.vel) for n in result]==[(19,69,99),(20,72,101)],
            'Sax projection changed melodic attacks, pitches or expression')
    require(result[0].dur==1 and result[1].dur==3,'Sax projection left the inherited two-beat overlap')
    ordinary=Clip([(0,.5,65,80),(1,1,67,95),(3,.25,69,85)],length=4)
    require(list(sax_line(ordinary))==list(ordinary),'Sax projection changed an already monophonic line')
    chord=Clip([(0,2,60,80),(0,2,67,90),(1,2,69,95)],length=4)
    fitted=list(sax_line(chord))
    require([(n.start,n.pitch) for n in fitted]==[(0,67),(1,69)],'Sax chord projection lost the top melody')
    require(all(a.start+a.dur<=b.start for a,b in zip(fitted,fitted[1:])),
            'Sax projection retained sustained polyphony')


def check_legacy(web, refs):
    records=[];reference_fx=None
    for ref in refs:
        index=json.loads(historical(ref,'music/endless/bank/index.json'))
        selected={}
        for n in range(index['counts']['jazz']):
            entry=json.loads(gzip.decompress(historical(ref,f'music/endless/bank/jazz/{n}.json.gz')))
            feel=entry['info']['feel']
            if feel in ('straight','ballad','bossa') and feel not in selected:selected[feel]=entry
            if len(selected)==3:break
        require(len(selected)==3,f'{ref}: missing historical styles')
        for feel,old in selected.items():
            if ref==refs[-1] and reference_fx is None:
                reference_fx=next(t['fx'] for t in json.loads(old['render'])['tracks'] if t['id']=='sax')
            for mode in ('beste','spar'):
                recipe=dict(old['recipe'],p=mode);web.MISSING.clear();out=web.compose_recipe(recipe)
                expected=old['hash'] if mode=='beste' else old['hash_spar']
                require(out['hash']==expected,f'{ref}/{feel}/{mode}: historical render changed')
                require(not web.MISSING,f'{ref}/{feel}/{mode}: missing tables {web.MISSING}')
                if mode=='beste':
                    require(out['render']==old['render'],f'{ref}/{feel}: historical bytes changed')
                else:
                    document=json.loads(old['render'])
                    for track in document['tracks']:
                        if track['id'] in old['spar_samples']:
                            track['instrument']['params']['samples']=old['spar_samples'][track['id']]
                    require(out['render']==web.dumps(document),f'{ref}/{feel}: historical compact-mode bytes changed')
                require(out['recipe']['slot']==recipe['slot'],f'{ref}: changed saved slot')
                records.append(dict(ref=ref,feel=feel,mode=mode,hash=expected))
    return records,reference_fx


def run(args,mirror):
    global HASH,JAZZ
    HASH=json.loads((WEB/'samples/index.json').read_text())
    JAZZ=json.loads((WEB/'samples/jazz/index.json').read_text())
    web=init(mirror)
    check_monophonic_projection()
    legacy,fx=check_legacy(web,args.legacy_ref)
    paths=[]
    if args.matched_dir:paths=sorted(args.matched_dir.glob('*-after.json'))
    elif args.bank:paths=sorted(args.bank.glob('*.json.gz'),key=lambda p:int(p.name.split('.')[0]))
    require(bool(paths),'Provide --matched-dir or --bank with generated quartet-3 pieces')
    rows=[];selected={}
    for path in paths:
        out=json.loads(gzip.decompress(path.read_bytes())) if path.name.endswith('.gz') else json.loads(path.read_text())
        rows.append(check_piece(out,fx));selected.setdefault(out['info']['feel'],out)
    replayed=[]
    for feel in ('straight','ballad','bossa','waltz','shuffle'):
        if feel not in selected:continue
        entry=selected[feel]
        for mode in ('beste','spar'):
            recipe=dict(entry['recipe'],p=mode);web.MISSING.clear()
            a=web.compose_recipe(recipe);b=web.compose_recipe(recipe)
            require(a['render']==b['render'],f'{feel}/{mode}: non-deterministic replay')
            require(not web.MISSING,f'{feel}/{mode}: missing tables')
            if mode=='beste':require(a['render']==entry['render'],f'{feel}: recipe differs from stored render')
            check_piece(a,fx)
            replayed.append(dict(feel=feel,mode=mode,hash=a['hash']))
    # A complete set plus the first piece of the next: bank continuation must survive its boundary.
    session=web.Session('jazz',182);resumed=web.Session('jazz',182);sequence=[]
    for n in range(7):
        web.MISSING.clear();out=session.next();require(not web.MISSING,f'session {n}: missing tables')
        check_piece(out,fx)
        if n==0:resumed.skip_first(out['info']['key'])
        else:require(resumed.next()['render']==out['render'],f'bank continuation diverges at piece {n+1}')
        sequence.append(out['hash'])
    report=dict(status='passed',version=web.VERSION,monophonic_projection='passed',legacy=legacy,new_pieces=rows,replayed=replayed,
                bank_continuation_pieces=len(sequence),feels=dict(Counter(r['feel'] for r in rows)))
    if args.out:args.out.write_text(json.dumps(report,indent=2))
    print(json.dumps(dict(status='passed',version=web.VERSION,legacy_recipes=len(legacy),new_pieces=len(rows),
                         replayed=len(replayed),bank_continuation_pieces=len(sequence))))


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--mirror',type=Path)
    p.add_argument('--archive',type=Path,default=HERE/'repo.zip')
    p.add_argument('--legacy-ref',action='append',default=None)
    p.add_argument('--matched-dir',type=Path)
    p.add_argument('--bank',type=Path)
    p.add_argument('--out',type=Path)
    args=p.parse_args();args.legacy_ref=args.legacy_ref or ['9d4de59e','498d071b']
    if args.mirror:run(args,args.mirror.resolve())
    else:
        with tempfile.TemporaryDirectory(prefix='jazz-evolution-') as directory:
            with zipfile.ZipFile(args.archive) as z:z.extractall(directory)
            run(args,Path(directory))
if __name__=='__main__':main()
