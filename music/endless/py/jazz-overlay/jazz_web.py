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

REVISION = 'quartet-2'
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
                    form=form, solo_span=1 if f=='ballad' else rng.choice([1,2]),
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



def build(seed, slot):
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
    sax.sends.pop('echo', None)
    sax.fx.append(fx.eq({'peak3.freq':3300,'peak3.gain':-2,'peak3.q':1}))
    # Preserve FX indices: the horn performance writes numeric air automation targets.
    # A unity utility replaces the compressor; removing its slot would misroute those lanes.
    for index,effect in enumerate(sax.fx):
        if effect.type == 'compressor': sax.fx[index]=fx.utility(gain=0)
        elif effect.type == 'saturator': effect.params.update(drive=3,mix=.2)
        elif effect.type == 'tape': effect.params['drive']=2
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
    s.jazz_audit=audit
    s.jazz_slot=slot
    return tune,s


def output(seed,slot,piano='beste',extra=None):
    import compose_web as web
    t0=time.perf_counter()
    web.MODE['piano']=piano
    tune,song=build(seed,slot)
    out=web._output('jazz',piano,tune,song,seed,slot,extra or {})
    out['info'].update(quartet=REVISION,roles=['sax','piano','comp','bass','drums'],layout=slot['layout'],compose_s=round(time.perf_counter()-t0,2))
    out['tune']['quartet']=slot
    out['tune']['performance']=song.jazz_audit
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
