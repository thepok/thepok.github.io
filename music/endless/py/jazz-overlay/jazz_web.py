"""Replayable jazz quartet: composed heads, conversational solos and a varied six-song set.

Only the browser jazz entry uses this module; piano/orchestra composers are untouched.
"""
import copy
import hashlib
import json
import random
import time
from agentsound import Song, Clip, jazz, hornist, hero, fx
from agentsound.patches import inst
from agentsound.endless.composer import compose, set_plan
from agentsound.endless.genres import get
from agentsound.song import dumps
from agentsound.theory import chord

REVISION = 'quartet-3'
GENRE = get('jazz-trio')


def plan_set(seed, previous=None):
    plan = set_plan(GENRE, 6, seed, prev_key=previous)
    rng = random.Random(f'quartet-set:{seed}')
    feels = ['straight', 'bossa', 'ballad', 'waltz', 'straight', 'shuffle']
    # Constrained permutations: every set contains the palette, opening and order vary.
    for _ in range(32):
        rng.shuffle(feels)
        if all(a != b for a,b in zip(feels,feels[1:])): break
    moods = {'straight': 'bright', 'bossa': 'bright', 'ballad': 'tender', 'waltz': 'late-night', 'shuffle': 'blue'}
    tempos = {'straight': (118, 158), 'bossa': (112, 132), 'ballad': (64, 76), 'waltz': (132, 166), 'shuffle': (100, 124)}
    layouts = ['sax-piano', 'piano-sax', 'bass-dialogue', 'piano-sax', 'trading', 'sax-piano']
    rng.shuffle(layouts)
    last_form = None
    for i, slot in enumerate(plan):
        f = feels[i]
        forms=['AABA','ABAC']
        form = 'blues' if f=='shuffle' else rng.choice(forms)
        if form==last_form and f!='shuffle': form=next(x for x in forms if x!=last_form)
        last_form=form
        slot.update(feel=f, mood=moods[f], tempo=rng.randint(*tempos[f]), quartet=REVISION,
                    layout=layouts[i], comp_style=rng.choice(['swing', 'charleston', 'garland']),
                    ending=rng.choice(['held', 'tag', 'stop']), intro=rng.choice([2, 4]),
                    entry=rng.choice(['piano','bass','piano']), head_entry=rng.choice(['sax','sax','piano']),
                    sax_sound='hero-default-1', form=form, solo_span=1 if f=='ballad' else rng.choice([1,2]),
                    reprise=rng.choice(['last','half','full']),development=rng.choice(['rise','space','answer']))
    return plan


def _fit(clip, lo, hi):
    # Preserve contours with one transposition whenever possible; never octave-fold individual notes.
    notes = list(clip)
    if not notes: return clip
    shifts = [k for k in range(-48,49,12) if all(lo <= n.pitch+k <= hi for n in notes)]
    if shifts:
        shift = min(shifts, key=lambda k: abs(sum(n.pitch+k for n in notes)/len(notes)-(lo+hi)/2))
        return Clip([(n.start,n.dur,n.pitch+shift,n.vel) for n in notes], length=clip.length)
    # Wide melodies are compressed monotonically, retaining direction and repeated notes.
    # Select among the original pitch classes so the harmonic vocabulary is retained.
    pitches=sorted({n.pitch for n in notes}); low,high=pitches[0],pitches[-1]
    pcs={p%12 for p in pitches}
    available=[p for p in range(lo,hi+1) if p%12 in pcs]
    mapping={p:min(available,key=lambda q:abs(q-(lo+(p-low)*(hi-lo)/max(1,high-low)))) for p in pitches}
    return Clip([(n.start,n.dur,mapping[n.pitch],n.vel) for n in notes],length=clip.length)



def _build_v2(seed, slot):
    swing = None if slot['feel'] == 'bossa' else jazz.swing_ratio(slot['tempo'])
    tune = compose(GENRE, int(seed), plan=slot, swing=swing)
    # One coherent register translation for each complete head, with contour-safe limiting only
    # if a piano-derived theme exceeds the sampled sax's 24-semitone singing compass.
    for p,notes in tune.melody.items():
        clip=_fit(tune.clip(notes,tune.part_beats(p)),57,80)
        tune.melody[p]=[(n.start,n.dur,n.pitch) for n in clip]
    s = Song(tune.title, tempo=tune.tempo, key=tune.key, seed=int(seed)%100000+1, tail=4, meter=(tune.meter,4))
    feel = jazz.Feel(tune.tempo, ratio=tune.swing or .5, beats_per_bar=tune.meter)
    b = jazz.band(s, piano=inst.sfz('samples/splendid-grand-piano/Splendid Grand Piano.sfz', polyphony=96),
                  bass='sampled/upright_bass', drums='sampled/brush_kit', sampled_sounds=False, feel=feel)
    b.bass.gain_db += 1.5
    b.drums.gain_db += 4
    b.piano.gain_db -= 2
    sax = hero(s.track('sax', 'hero/sax', gain_db=2 if tune.feel=='ballad' else 5, pan=-.2), family='sax', genre='jazz', double=False,
               octave=False, duck=False, carve=False, dips=False, ride=False, throws=False)
    default_hero = slot.get('sax_sound') == 'hero-default-1'
    if not default_hero: sax.sends.pop('echo', None)
    hero_compressor = next(effect for effect in sax.fx if effect.type == 'compressor')
    # Keep the identity EQ slot for published mic-automation indices.
    sax.fx.append(fx.eq({'peak3.freq':3300,'peak3.gain':0 if default_hero else -2,'peak3.q':1}))
    # Preserve FX indices: the horn performance writes numeric air automation targets.
    # A unity utility replaces the compressor; removing its slot would misroute those lanes.
    for index,effect in enumerate(sax.fx):
        if effect.type == 'compressor': sax.fx[index]=fx.utility(gain=0)
        elif effect.type == 'saturator' and not default_hero: effect.params.update(drive=3,mix=.2)
        elif effect.type == 'tape' and not default_hero: effect.params['drive']=2
    b.drums.fx.append(fx.eq({'hp.freq':85,'hp.slope':24,'low.freq':120,'low.gain':-3}))
    s.master.gain_db = 0
    s.master.add(fx.limiter(gain=0,ceiling=-1.2,release=180))
    memory = hornist.Memory()
    piano_memory = jazz._pianist.Memory()
    audit = []
    count = 0
    solo_count={'sax':0,'piano':0,'bass':0}
    motif = _fit(tune.clip(tune.motif, 2*tune.meter), 57, 79)

    def section(label, changes, melody=None, lead='sax', energy=.5, head=False):
        nonlocal count
        count += 1
        sd = int(seed)*31+count*101
        length = sum(d for _,d in changes)
        sec = s.section(label, length/tune.meter, prog=tune.changes_str(changes=changes))
        prog = sec.prog
        if melody is None:
            stage=solo_count[lead];solo_count[lead]+=1
            develop=slot.get('development','rise')
            thematic=motif
            if stage and develop=='space':
                thematic=Clip([(n.start*1.5,n.dur*1.3,n.pitch,n.vel) for n in motif],length=motif.length*1.5)
            elif stage and develop=='answer':
                thematic=Clip([(n.start+.5,n.dur,n.pitch,n.vel) for n in motif],length=motif.length+.5)
            reg = ((60,80) if stage and develop=='rise' else (57,76)) if lead == 'sax' else (60,88) if lead == 'piano' else (40,60)
            melody = jazz.solo_line(prog, key=s.key, register=reg, density=.30+.4*energy,
                        intensity=energy, seed=sd, motif=thematic, motif_prob=.8 if stage==0 else .6,
                        phrase_bars=(1,2.5), rest_beats=(1.5,3.5), vel=78+12*energy,
                        chromatic=.22+.15*energy, triplets=.08 if tune.feel!='bossa' else .02)
        melody = _fit(melody,57,80) if lead=='sax' else melody
        if lead == 'sax':
            played = hornist.arrange(feel.swing(melody), tune.tempo, family='sax', style='jazz',
                         seed=sd, memory=memory, at=sec.start, bpb=tune.meter, energy=energy,
                         vel=(66+int(12*energy),92+int(17*energy)), max_phrase=2*tune.meter,
                         late_ms=feel.late_ms('sax'), depth=.75, climax=energy>.85)
            played.place(sax,sec.start)
        elif lead == 'piano':
            arr = jazz.pianist(jazz.touch(melody,60,104), prog,bpm=tune.tempo,key=s.key,
                       style='ballad' if tune.feel=='ballad' else 'straight',density=.38+.2*energy,
                       lh='rootless', lh_vel=44+10*energy, seed=sd,memory=piano_memory,
                       at=sec.start, ceiling=88)
            arr.place(b.piano,b.comp,pedal=tune.feel=='ballad')
        elif lead == 'bass':
            b.bass.play(jazz.bass_touch(melody,79,110,seed=sd),sec.start)
        if lead != 'piano':
            style = 'waltz' if tune.meter==3 else 'sparse' if lead=='bass' else 'ballad' if tune.feel=='ballad' else 'bossa' if tune.feel=='bossa' else slot['comp_style']
            c = jazz.comp(prog,style=style,voicing='rootless',register=(48,72),density=.25+.3*energy,
                          intensity=.25+.25*energy,answer=melody,vel=51+10*energy,seed=sd)
            b.comp.play(c,sec.start)
        if lead != 'bass' and label != 'Intro':
            two = head or energy<.4
            bassfeel = ('two' if two else 'walk') if tune.meter==3 else 'two' if two else 'four'
            if tune.feel=='bossa': bassfeel='push'
            bass = jazz.walking_bass(prog,key=s.key,feel=bassfeel,low='E1',high='D3',seed=sd,
                         vel=75+12*energy,straight=tune.feel=='bossa' or tune.meter==3,beats_per_bar=tune.meter)
            b.bass.play(bass,sec.start)
        drums = jazz.brushes(sec.bars,style='ballad' if energy<.4 else 'medium',kit=jazz.SWIRLY_BRUSH,
                       sweep=jazz.swirly_sweep(tune.tempo,tune.meter),vel=.48+.28*energy,seed=sd,
                       beats_per_bar=tune.meter,straight=tune.feel=='bossa',ride=energy>.8,
                       fills=energy>.4,phrase=8,ghosts=.12 if tune.feel=='bossa' else 0)
        if lead=='bass':
            drums = Clip([(n.start,n.dur,n.pitch,max(1,int(n.vel*.55))) for n in drums
                          if n.pitch in (jazz.SWIRLY_BRUSH['hat_foot'],jazz.SWIRLY_BRUSH['sweep'])],length=length)
        if label != 'Intro': b.drums.play(drums,sec.start)
        audit.append(dict(name=label,start=sec.start,end=sec.end,lead=lead,energy=energy,
                          changes=changes,melody=[list(n) for n in melody],head=head))
        return sec

    # Intro quotes the hook in the piano; every head A belongs to the same tune's motif.
    intro_bars = slot.get('intro',4)
    intro_changes=[]; remain=intro_bars*tune.meter
    for sym,dur in tune.intro['changes']:
        if remain<=0: break
        intro_changes.append((sym,min(remain,dur)));remain-=dur
    if remain>0: intro_changes.append((tune.intro['changes'][-1][0],remain))
    intro_mel=tune.clip(tune.intro['melody'],sum(d for _,d in intro_changes)).slice(0,intro_bars*tune.meter)
    entry=slot.get('entry','piano')
    section('Intro',intro_changes,_fit(intro_mel,36,60) if entry=='bass' else intro_mel,lead=entry,energy=.25)
    for i,p in enumerate(tune.parts):
        section(f'Thema {p}',tune.changes[p],tune.melody_clip(p),lead=slot.get('head_entry','sax') if i==0 else 'sax',energy=.42+.12*i/max(1,len(tune.parts)-1),head=True)
    # Two contrasting solo voices. Short blues forms get full choruses, 32-bar forms half choruses.
    solo_parts=tune.parts if tune.form=='blues' else tune.parts[:slot.get('solo_span',2)]
    order=['piano','sax'] if slot['layout']=='piano-sax' else ['sax','piano']
    for j,role in enumerate(order):
        for i,p in enumerate(solo_parts):
            section(f'{role.title()} Solo {i+1}',tune.changes[p],lead=role,energy=.55+.28*j+.08*i)
    if slot['layout']=='bass-dialogue':
        p=tune.parts[-1]
        section('Bass Solo',tune.changes[p],lead='bass',energy=.35)
    elif slot['layout']=='trading':
        # Four-bar questions and answers over one eight-bar chart; no simultaneous lead collision.
        p=tune.parts[-1]; chart=tune.changes[p]
        a=[];z=[];remaining=4*tune.meter
        for sym,d in chart:
            take=min(remaining,d)
            if take>0:a.append((sym,take));remaining-=take
            if d>take:z.append((sym,d-take))
        section('Sax Frage',a,lead='sax',energy=.9)
        if z:section('Piano Antwort',z,lead='piano',energy=.75)
    reprise=slot.get('reprise','half')
    out_parts=tune.parts if reprise=='full' and tune.feel!='ballad' else tune.parts[-1:] if reprise=='last' or tune.feel=='ballad' else tune.parts[-2:]
    for i,p in enumerate(out_parts):
        section(f'Reprise {p}',tune.changes[p],jazz.paraphrase(tune.melody_clip(p),seed=int(seed)+i,anticipate=.12,delay=.08,embellish=.06,key=s.key) if i==len(out_parts)-1 else tune.melody_clip(p),energy=max(.3,.6-.1*i),head=True)
    # Cadential tag quotes the original composed tag, then one intentional final sonority.
    if slot['ending']=='tag':section('Tag',tune.tag['changes'],tune.clip(tune.tag['melody'],sum(d for _,d in tune.tag['changes'])),energy=.3,head=True)
    last=s.section('Schluss',2,prog=f'{tune.end_chord}:2')
    duration=.6 if slot['ending']=='stop' else tune.meter*1.7
    b.comp.play(Clip([(0,duration,q,49) for q in jazz.rootless(tune.end_chord)],length=2*tune.meter),last.start)
    root=chord(tune.end_chord).root
    b.bass.play(Clip([(0,.6 if slot['ending']=='stop' else tune.meter*1.6,36+root%12,72)],length=2*tune.meter),last.start)
    b.drums.play(Clip([(0,2,jazz.SWIRLY_BRUSH['crash'],28)],length=2*tune.meter),last.start)
    # Restore the unmodified default Hero compressor after Hornist has placed its
    # mic EQ: its numeric air/proximity lanes remain exactly as in legacy recipes.
    if default_hero: sax.fx[1] = hero_compressor
    s.jazz_audit=audit
    s.jazz_slot=slot
    return tune,s



def chart_slice(changes, start, length):
    """Exact beat slice; unlike bar-count assumptions this handles 3/4 and 12-bar charts."""
    out=[];pos=0
    for symbol,dur in changes:
        left=max(start,pos);right=min(start+length,pos+dur)
        if right>left:out.append((symbol,right-left))
        pos+=dur
    if abs(sum(d for _,d in out)-length)>1e-6:
        raise ValueError('requested chart slice exceeds chart')
    return out


def _prog(changes, key, meter):
    from agentsound.theory import Progression
    return Progression([(symbol,dur/meter) for symbol,dur in changes],key=key,beats_per_bar=meter)


def utterance(clip, meter=4, max_notes=8):
    """Remember a recent singable cell, never a complete long solo squeezed into a new phrase."""
    ns=sorted(clip,key=lambda n:n.start)
    if not ns:return Clip([],length=meter)
    end=ns[-1].start+ns[-1].dur
    # First find the final breath-separated utterance, then its latest two-bar idea.
    cut=0
    for i,(a,b) in enumerate(zip(ns,ns[1:])):
        if b.start-(a.start+a.dur)>=.65:cut=i+1
    own=[n for n in ns[cut:] if n.start>=end-2*meter][-max_notes:]
    if len(own)<3:
        # A final long cadence note is not always the identity of the preceding idea.
        # Retain its distinctive lead-in when it fits the same bounded window.
        context=[n for n in ns if n.start>=end-2*meter][-max_notes:]
        if len(context)>=3:own=context
    if not own:own=ns[-1:]
    start=own[0].start
    return Clip([(n.start-start,n.dur,n.pitch,n.vel) for n in own],length=max(meter,end-start))


def response(question, prog, key, length, register, mode='answer', resolve=True):
    """A reply depends on the actual question: retain rhythm, vary contour, land in its new harmony."""
    src=list(utterance(question,prog.beats_per_bar))
    if not src:return Clip([],length=length)
    # The most recent utterance, rather than arbitrary old theme, supplies identity.
    anchor=src[0].pitch
    end=max(n.start+n.dur for n in src);begin=min(n.start for n in src)
    room=max(1,length-1.0)
    # Never accelerate a remembered phrase to make it fit. Retain or lengthen time.
    # Augment a compact cell once; already spacious material keeps its time scale.
    # Repeated handovers must not multiply held lengths by 1.5 indefinitely.
    factor=1.5 if mode=='space' and max(n.dur for n in src)<=1.0 and end-begin<=room/1.5 else 1.0
    notes=[]
    for n in src:
        at=.5+(n.start-begin)*factor
        if at>=length-1:break
        pitch=anchor-(n.pitch-anchor) if mode=='answer' else n.pitch+(2 if mode=='rise' else 0)
        notes.append((at,min(n.dur*factor,length-1-at),pitch,n.vel))
    raw=_fit(Clip(notes,length=length),*register)
    fitted=[];last_raw=None;last_pitch=None
    for n in raw:
        h=prog.at(n.start)
        pcs={(h.root+d)%12 for d in jazz.chord_scale(h)} if h else set(range(12))
        direction=0 if last_raw is None else (n.pitch>last_raw)-(n.pitch<last_raw)
        def distance(p):
            contour=0 if last_pitch is None or not direction or (p-last_pitch)*direction>0 else 2.1
            return abs(p-n.pitch)+contour
        pitch=min((p for p in range(register[0],register[1]+1) if p%12 in pcs),key=distance)
        fitted.append((n.start,n.dur,pitch,n.vel));last_raw=n.pitch;last_pitch=pitch
    # Inner notes may be scale tensions. Only the cadence must settle to a chord tone;
    # snapping every held note to a chord tone erased stepwise kernels across handovers.
    line=Clip(fitted,length=length)
    if resolve and len(line):
        ns=list(line);last=ns[-1];h=prog.at(last.start)
        if h:
            target=min((q for q in range(*[register[0],register[1]+1]) if q%12 in h.pcs),key=lambda q:abs(q-last.pitch))
            ns[-1]=last._replace(pitch=target,dur=min(max(.75,last.dur),length-.5-last.start))
        line=Clip([tuple(n) for n in ns],length=length)
    return line


def solo_story(changes, key, meter, seed, source, lead, development, energy, shape='rise', kernel=None):
    """Selective phrase memory inside short solos as well as across lead handovers."""
    length=sum(d for _,d in changes);bars=length/meter
    register=(57,80) if lead=='sax' else (60,88) if lead=='piano' else (40,60)
    # A statement, a consequence, then room to depart: not a perpetual two-bar loop.
    sizes=[2,2] if bars<=4 else [2,2,bars-4] if bars<=8 else [3,3,bars-6] if meter==4 else [2,4,bars-6]
    sizes=[n for n in sizes if n>0]
    out=[];audit=[];at=0;previous=utterance(source,meter)
    # Like the orchestra's Kernel, identity is immutable. Conversation remembers the
    # actual last utterance, while a later recall starts from this untransformed cell.
    identity=utterance(kernel if kernel is not None else source,meter)
    for i,nbar in enumerate(sizes):
        span=nbar*meter;chart=chart_slice(changes,at,span);prog=_prog(chart,key,meter)
        used_source=previous
        if i==0:
            line=response(previous,prog,key,span,register,'space' if shape=='sparse' else 'rise' if lead=='bass' else 'answer',False)
            action='handover'
        elif i==1:
            line=response(previous,prog,key,span,register,development,True)
            action=development
        else:
            # The departure recalls the stable identity instead of recursively reprocessing
            # a cadence fragment from the previous transformation.
            used_source=identity
            line=jazz.solo_line(prog,key=key,register=register,density=.3 if shape=='sparse' else .4+.2*energy,
                     intensity=energy,seed=seed+i,motif=identity,motif_prob=.8,phrase_bars=(1,2),
                     rest_beats=(1.5,3),vel=86,chromatic=.2,triplets=.05)
            action='recall-depart-resolve'
            if len(line):
                notes=list(line);last=notes[-1];h=prog.at(last.start)
                if h:
                    target=min((q for q in range(register[0],register[1]+1) if q%12 in h.pcs),key=lambda q:abs(q-last.pitch))
                    notes[-1]=last._replace(pitch=target)
                    line=Clip([tuple(n) for n in notes],length=span)
        if len(line):
            line=Clip([(q.start,min(q.dur,max(.05,span-.5-q.start)),q.pitch,q.vel) for q in line if q.start<span-.5],length=span)
        audit.append(dict(at=at,end=at+span,action=action,source=[list(q) for q in used_source],notes=[list(q) for q in line]))
        out.extend((q.start+at,q.dur,q.pitch,q.vel) for q in line)
        previous=utterance(line,meter);at+=span
    return Clip(out,length=length),previous,audit


def sax_line(clip):
    """A piano lead sheet may sustain one pitch into the next; a sax is one voice.

    Keep its attack sequence and melodic pitches, releasing the previous note at
    the new attack. Hornist subsequently supplies its short intentional legato.
    Simultaneous written chord tones use the top melodic voice.
    """
    attacks={}
    for n in clip:
        if n.start not in attacks or n.pitch>attacks[n.start].pitch:attacks[n.start]=n
    ns=sorted(attacks.values(),key=lambda n:n.start);out=[]
    for i,n in enumerate(ns):
        end=ns[i+1].start if i+1<len(ns) else clip.length
        duration=min(n.dur,end-n.start)
        if duration>0:out.append((n.start,duration,n.pitch,n.vel))
    return Clip(out,length=clip.length)


def phrase_landmarks(melody, length, meter, protect=False, cadence=False):
    """Select one consequential space; accompaniment is steady outside these written decisions."""
    ns=sorted(melody,key=lambda n:n.start)
    gaps=[]
    for a,b in zip(ns,ns[1:]):
        left=a.start+a.dur;right=b.start
        if right-left>=.75 and left>=meter and right<=length-meter:
            gaps.append((left,right))
    gap=max(gaps,key=lambda g:g[1]-g[0]) if gaps and protect else None
    last_end=max((n.start+n.dur for n in ns),default=length)
    fill=(max(length-meter,last_end),length) if cadence and last_end<length-.4 else None
    return dict(gap=gap,fill=fill)


def _protect(clip, gap):
    if not gap:return clip
    a,b=gap;out=[]
    for n in clip:
        if a<=n.start<b:continue
        dur=min(n.dur,a-n.start) if n.start<a<n.start+n.dur else n.dur
        if dur>.03:out.append((n.start,dur,n.pitch,n.vel))
    return Clip(out,length=clip.length)


def bossa_drums(bars, meter, energy):
    """Restrained two-bar brush/foot grammar; no extra kit or synthetic cross-stick."""
    kit=jazz.SWIRLY_BRUSH;notes=[]
    for bar in range(int(bars)):
        t=bar*meter
        for beat in (0,1.5,2,3.5):notes.append((t+beat,.22,kit['kick'],int(29+8*energy)))
        for beat in (1,3):notes.append((t+beat,.22,kit['hat_foot'],32))
        for beat in ((0,1.5,3) if bar%2==0 else (.5,2)):
            notes.append((t+beat,.25,kit['tap'],int(39+14*energy)))
        if bar%2==0:notes.append((t,1.8,kit['sweep'],29))
    return Clip(notes,length=bars*meter)


def build(seed,slot):
    return _build_v3(seed,slot) if slot.get('quartet')=='quartet-3' else _build_v2(seed,slot)


def _build_v3(seed, slot):
    swing = None if slot['feel'] == 'bossa' else jazz.swing_ratio(slot['tempo'])
    tune = compose(GENRE, int(seed), plan=slot, swing=swing)
    # One coherent register translation for each complete head, with contour-safe limiting only
    # if a piano-derived theme exceeds the sampled sax's 24-semitone singing compass.
    for p,notes in tune.melody.items():
        clip=_fit(tune.clip(notes,tune.part_beats(p)),57,80)
        tune.melody[p]=[(n.start,n.dur,n.pitch) for n in clip]
    s = Song(tune.title, tempo=tune.tempo, key=tune.key, seed=int(seed)%100000+1, tail=4, meter=(tune.meter,4))
    feel = jazz.Feel(tune.tempo, ratio=tune.swing or .5, beats_per_bar=tune.meter)
    b = jazz.band(s, piano=inst.sfz('samples/splendid-grand-piano/Splendid Grand Piano.sfz', polyphony=96),
                  bass='sampled/upright_bass', drums='sampled/brush_kit', sampled_sounds=False, feel=feel)
    b.bass.gain_db += 1.5
    b.drums.gain_db += 4
    b.piano.gain_db -= 2
    sax = hero(s.track('sax', 'hero/sax', gain_db=2 if tune.feel=='ballad' else 5, pan=-.2), family='sax', genre='jazz', double=False,
               octave=False, duck=False, carve=False, dips=False, ride=False, throws=False)
    default_hero = slot.get('sax_sound') == 'hero-default-1'
    if not default_hero: sax.sends.pop('echo', None)
    hero_compressor = next(effect for effect in sax.fx if effect.type == 'compressor')
    # Keep the identity EQ slot for published mic-automation indices.
    sax.fx.append(fx.eq({'peak3.freq':3300,'peak3.gain':0 if default_hero else -2,'peak3.q':1}))
    # Preserve FX indices: the horn performance writes numeric air automation targets.
    # A unity utility replaces the compressor; removing its slot would misroute those lanes.
    for index,effect in enumerate(sax.fx):
        if effect.type == 'compressor': sax.fx[index]=fx.utility(gain=0)
        elif effect.type == 'saturator' and not default_hero: effect.params.update(drive=3,mix=.2)
        elif effect.type == 'tape' and not default_hero: effect.params['drive']=2
    b.drums.fx.append(fx.eq({'hp.freq':85,'hp.slope':24,'low.freq':120,'low.gain':-3}))
    s.master.gain_db = 0
    s.master.add(fx.limiter(gain=0,ceiling=-1.2,release=180))
    memory = hornist.Memory()
    piano_memory = jazz._pianist.Memory()
    audit = []
    count = 0
    previous_phrase=None
    shared_story=[]
    motif = _fit(tune.clip(tune.motif, 2*tune.meter), 57, 79)

    def section(label, changes, melody=None, lead='sax', energy=.5, head=False, source=None, protect=False, cadence=False, chart_role=None):
        nonlocal count,previous_phrase
        count += 1
        sd = int(seed)*31+count*101
        length = sum(d for _,d in changes)
        sec = s.section(label, length/tune.meter, prog=tune.changes_str(changes=changes))
        prog = sec.prog
        phrasing=[]
        if melody is None:
            source=source if source is not None else previous_phrase if previous_phrase is not None else motif
            melody,previous_phrase,phrasing=solo_story(changes,s.key,tune.meter,sd,source,lead,
                     slot.get('development','rise'),energy,tune.solo_shape or 'rise',kernel=motif)
        if lead=='sax':melody=sax_line(melody)
        marks=phrase_landmarks(melody,length,tune.meter,protect,cadence)
        melody = _fit(melody,57,80) if lead=='sax' else melody
        if lead == 'sax':
            played = hornist.arrange(feel.swing(melody), tune.tempo, family='sax', style='jazz',
                         seed=sd, memory=memory, at=sec.start, bpb=tune.meter, energy=energy,
                         vel=(66+int(12*energy),92+int(17*energy)), max_phrase=2*tune.meter,
                         late_ms=feel.late_ms('sax'), depth=.75, climax=energy>.85)
            played.place(sax,sec.start)
        elif lead == 'piano':
            arr = jazz.pianist(jazz.touch(melody,60,104), prog,bpm=tune.tempo,key=s.key,
                       style='ballad' if tune.feel=='ballad' else 'straight',density=.38+.2*energy,
                       lh='rootless', lh_vel=44+10*energy, seed=sd,memory=piano_memory,
                       at=sec.start, ceiling=88)
            arr.rh=_protect(_protect(arr.rh,marks['gap']),marks['fill'])
            arr.lh=_protect(arr.lh,marks['gap'])
            arr.place(b.piano,b.comp,pedal=tune.feel=='ballad')
        elif lead == 'bass':
            b.bass.play(jazz.bass_touch(melody,79,110,seed=sd),sec.start)
        if lead != 'piano':
            style = 'waltz' if tune.meter==3 else 'sparse' if lead=='bass' else 'ballad' if tune.feel=='ballad' else 'bossa' if tune.feel=='bossa' else slot['comp_style']
            c = jazz.comp(prog,style=style,voicing='rootless',register=(48,72),density=.25+.3*energy,
                          intensity=.25+.25*energy,answer=melody,vel=51+10*energy,seed=sd)
            b.comp.play(_protect(c,marks['gap']),sec.start)
        if lead != 'bass' and label != 'Intro':
            two = head or energy<.4
            bassfeel = ('two' if two else 'walk') if tune.meter==3 else 'two' if two else 'four'
            if tune.feel=='bossa': bassfeel='push'
            bass = jazz.walking_bass(prog,key=s.key,feel=bassfeel,low='E1',high='D3',seed=sd,
                         vel=75+12*energy,straight=tune.feel=='bossa' or tune.meter==3,beats_per_bar=tune.meter)
            b.bass.play(_protect(bass,marks['gap']),sec.start)
        drums = jazz.brushes(sec.bars,style='ballad' if energy<.4 else 'medium',kit=jazz.SWIRLY_BRUSH,
                       sweep=jazz.swirly_sweep(tune.tempo,tune.meter),vel=.48+.28*energy,seed=sd,
                       beats_per_bar=tune.meter,straight=tune.feel=='bossa',ride=energy>.8,
                       fills=False,phrase=max(1,int(sec.bars)),ghosts=.12 if tune.feel=='bossa' else 0)
        if tune.feel=='bossa':drums=bossa_drums(sec.bars,tune.meter,energy)
        drums=_protect(drums,marks['gap'])
        if marks['fill']:
            fa,fz=marks['fill'];span=fz-fa
            drums=Clip([tuple(n) for n in drums if n.start<fa]+
                [(n.start+fa,n.dur,n.pitch,n.vel) for n in jazz.brush_fill('eighths',span,kit=jazz.SWIRLY_BRUSH,vel=(25,44))],length=length)
        if lead=='bass':
            drums = Clip([(n.start,n.dur,n.pitch,max(1,int(n.vel*.55))) for n in drums
                          if n.pitch in (jazz.SWIRLY_BRUSH['hat_foot'],jazz.SWIRLY_BRUSH['sweep'])],length=length)
        if label != 'Intro': b.drums.play(drums,sec.start)
        audit.append(dict(name=label,start=sec.start,end=sec.end,lead=lead,energy=energy,
                          changes=changes,melody=[list(n) for n in melody],head=head,
                          phrasing=phrasing,landmarks=marks,chart_role=chart_role))
        return sec

    # Intro quotes the hook in the piano; every head A belongs to the same tune's motif.
    intro_bars = slot.get('intro',4)
    intro_changes=[]; remain=intro_bars*tune.meter
    for sym,dur in tune.intro['changes']:
        if remain<=0: break
        intro_changes.append((sym,min(remain,dur)));remain-=dur
    if remain>0: intro_changes.append((tune.intro['changes'][-1][0],remain))
    intro_mel=tune.clip(tune.intro['melody'],sum(d for _,d in intro_changes)).slice(0,intro_bars*tune.meter)
    entry=slot.get('entry','piano')
    section('Intro',intro_changes,_fit(intro_mel,36,60) if entry=='bass' else intro_mel,lead=entry,energy=.25)
    # Native levels and climax govern interpretation, rather than block-number energy ladders.
    for i,p in enumerate(tune.parts):
        level=tune.part_level(p)
        peak=p==tune.climax.get('part')
        section(f'Thema {p}',tune.changes[p],tune.melody_clip(p),
                lead=slot.get('head_entry','sax') if i==0 else 'sax',
                energy=min(.88,.28+.5*level+(.12 if peak else 0)),head=True,
                protect=peak,cadence=i==len(tune.parts)-1,chart_role=p)
    order=['piano','sax'] if slot['layout']=='piano-sax' else ['sax','piano']
    # One native chorus is shared by the soloists, preserving its bridge and destination.
    # Slow/short concepts take an authored route: opening, contrasting harmony, final cadence.
    if tune.form=='blues':
        labels=(tune.solo_charts or tune.parts)[:2]
        if len(labels)<2:labels=labels*2
        routes=[[(labels[j],tune.changes[labels[j]])] for j in range(2)]
    elif tune.feel=='ballad' or slot.get('solo_span',2)==1:
        first=tune.parts[0];contrast=next((p for p in tune.parts if p[0] in 'BC'),tune.parts[-1]);final=tune.parts[-1]
        routes=[[(first,chart_slice(tune.changes[first],0,4*tune.meter))],
                [(contrast,chart_slice(tune.changes[contrast],0,4*tune.meter)),
                 (final,chart_slice(tune.changes[final],tune.part_beats(final)-4*tune.meter,4*tune.meter))]]
    else:
        middle=len(tune.parts)//2;routes=[[(p,tune.changes[p]) for p in tune.parts[:middle]],
                                        [(p,tune.changes[p]) for p in tune.parts[middle:]]]
    for j,role in enumerate(order):
        chart=[];provenance=[]
        for p,ch in routes[j]:
            own=tune.solo_changes.get(p) if j==1 and tune.reharm_in in ('both','solo') and len(ch)==len(tune.changes[p]) and sum(d for _,d in ch)==tune.part_beats(p) else None
            chart.extend(own or ch);provenance.append(p+(' reharm' if own else ''))
        # Early, sparse and climax-led forms need different handover intensity.
        shape=tune.solo_shape or 'rise'
        energy=(.78 if j==0 else .48) if shape=='early' else (.42 if j==0 else .53) if shape=='sparse' else (.56 if j==0 else .82)
        if tune.dynamics=='calm':energy-=.1
        section(f'{role.title()} Solo',chart,lead=role,energy=energy,protect=j==1,
                cadence=j==1,chart_role=provenance)
    if slot['layout']=='bass-dialogue':
        p=tune.parts[-1];chart=chart_slice(tune.changes[p],tune.part_beats(p)-4*tune.meter,4*tune.meter)
        section('Bass Antwort',chart,lead='bass',energy=.4,source=previous_phrase,cadence=True,chart_role=p)
    elif slot['layout']=='trading':
        # Exactly four plus four bars, chosen at the chart's cadence in EVERY meter/form.
        p=tune.parts[-1];chart=tune.solo_changes.get(p,tune.changes[p]);start=sum(d for _,d in chart)-8*tune.meter
        a=chart_slice(chart,start,4*tune.meter);z=chart_slice(chart,start+4*tune.meter,4*tune.meter)
        section('Sax Frage',a,lead='sax',energy=.72,source=previous_phrase,chart_role=p)
        question=Clip([tuple(n) for n in audit[-1]['melody']],length=4*tune.meter)
        answer=response(question,_prog(z,s.key,tune.meter),s.key,4*tune.meter,(60,88),slot.get('development','answer'))
        section('Piano Antwort',z,melody=answer,lead='piano',energy=.64,cadence=True,chart_role=p)
        audit[-1]['response_to']=[list(n) for n in question]
    # The return restores a recognizable A hook, then the native final destination.
    # A literal hook is intentional recognition, not a defect to randomize away.
    native_out=[p.rstrip('v') for p in tune.out_parts if p.rstrip('v') in tune.parts]
    first=tune.parts[0];final=(native_out or tune.parts)[-1]
    out_parts=[first,final] if final!=first and tune.feel!='ballad' else [first]
    for i,p in enumerate(out_parts):
        changes=tune.solo_changes.get(p,tune.changes[p]) if tune.reharm_in in ('both','out') and i==len(out_parts)-1 else tune.changes[p]
        melody=tune.melody_clip(p)
        if len(out_parts)==1 and final!=first:
            # Recognizable opening plus the native final cadence, not A's open turnaround into a hard stop.
            length=sum(d for _,d in changes);tail=4*tune.meter;cut=length-tail
            closing=tune.solo_changes.get(final,tune.changes[final]) if tune.reharm_in in ('both','out') else tune.changes[final]
            changes=chart_slice(changes,0,cut)+chart_slice(closing,sum(d for _,d in closing)-tail,tail)
            ending=tune.melody_clip(final).slice(tune.part_beats(final)-tail,tune.part_beats(final))
            opening=melody.slice(0,cut)
            melody=Clip([tuple(n) for n in opening]+[(n.start+cut,n.dur,n.pitch,n.vel) for n in ending],length=length)
        if changes!=tune.changes[p]:melody=melody.fit(_prog(changes,s.key,tune.meter),s.key)
        section(f'Reprise {p}',changes,melody,energy=.35+.25*tune.part_level(p),head=True,
                cadence=i==len(out_parts)-1,chart_role=p)
    # Cadential tag quotes the original composed tag, then one intentional final sonority.
    if slot['ending']=='tag':section('Tag',tune.tag['changes'],tune.clip(tune.tag['melody'],sum(d for _,d in tune.tag['changes'])),energy=.3,head=True)
    last=s.section('Schluss',2,prog=f'{tune.end_chord}:2')
    duration=.6 if slot['ending']=='stop' else tune.meter*1.7
    b.comp.play(Clip([(0,duration,q,49) for q in jazz.rootless(tune.end_chord)],length=2*tune.meter),last.start)
    root=chord(tune.end_chord).root
    b.bass.play(Clip([(0,.6 if slot['ending']=='stop' else tune.meter*1.6,36+root%12,72)],length=2*tune.meter),last.start)
    b.drums.play(Clip([(0,2,jazz.SWIRLY_BRUSH['crash'],28)],length=2*tune.meter),last.start)
    # Restore the unmodified default Hero compressor after Hornist has placed its
    # mic EQ: its numeric air/proximity lanes remain exactly as in legacy recipes.
    if default_hero: sax.fx[1] = hero_compressor
    s.jazz_audit=audit
    s.jazz_slot=slot
    s.jazz_story={'native_climax':tune.climax,'native_levels':tune.levels,'solo_shape':tune.solo_shape,'dynamics':tune.dynamics}
    return tune,s


def output(seed,slot,piano='beste',extra=None):
    import compose_web as web
    t0=time.perf_counter()
    web.MODE['piano']=piano
    tune,song=build(seed,slot)
    out=web._output('jazz',piano,tune,song,seed,slot,extra or {})
    out['info'].update(quartet=slot.get('quartet','quartet-2'),roles=['sax','piano','comp','bass','drums'],layout=slot['layout'],compose_s=round(time.perf_counter()-t0,2))
    out['tune']['quartet']=slot
    out['tune']['performance']=song.jazz_audit
    if hasattr(song,'jazz_story'):out['tune']['story']=song.jazz_story
    return out


class Session:
    def __init__(self,seed=1,piano='beste',first_candidates=None,candidates=None):
        self.seed=self.set_seed=int(seed);self.piano=piano;self.index=0;self.set_k=0
        self.n_first=self.n=1
        self.plan=plan_set(seed);self.prev_key=None
    def next(self):
        if self.set_k>=len(self.plan):
            self.plan=plan_set(self.seed,self.prev_key);self.set_k=0
        slot=self.plan[self.set_k]
        out=output(self.seed,slot,self.piano,dict(index=self.index+1,set_seed=self.set_seed,set_slot=self.set_k+1,set_size=6,candidates=1))
        self.seed+=1;self.index+=1;self.set_k+=1;self.prev_key=out['info']['key']
        return out
    def skip_first(self,key):
        self.seed+=1;self.index+=1;self.set_k+=1;self.prev_key=key
