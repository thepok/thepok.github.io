from pathlib import Path
import sys, re
root=Path(sys.argv[1])

p=root/'src/physics.ts'
s=p.read_text()
old=""" async settleStartup(){
  if(this.pieces.length<400||!this.rules.sandbox)return null;"""
new=""" async settleStartup(onProgress?:(completed:number,total:number)=>void){
  if(this.pieces.length<400||!this.rules.sandbox)return null;"""
assert s.count(old)==1
s=s.replace(old,new)
old="""  let steps=0,quiet=0,maxSpeed=Infinity;const started=performance.now();
  try{
   for(let i=0;i<180;i++){
    const gravityScale=Math.min(1,(i+1)/30),extra=Math.max(0,1-(i-45)/45),damping=Math.max(0,1-(i-45)/60);
    ramped.Set(gravity[0]*gravityScale,gravity[1]*gravityScale,gravity[2]*gravityScale);this.system.SetGravity(ramped);
    settings.mNumVelocitySteps=Math.round(velocitySteps+(Math.max(32,velocitySteps)-velocitySteps)*extra);settings.mNumPositionSteps=Math.round(positionSteps+(Math.max(8,positionSteps)-positionSteps)*extra);this.system.SetPhysicsSettings(settings);
    for(const state of bodies){state.motion.SetLinearDamping(state.linear+3*damping);state.motion.SetAngularDamping(state.angular+3*damping);}
    this.world.Step(1/60,1);steps++;
    if(i>=105){maxSpeed=0;for(const state of bodies)maxSpeed=Math.max(maxSpeed,state.body.GetLinearVelocity().Length(),state.body.GetAngularVelocity().Length()*4);quiet=maxSpeed<.035?quiet+1:0;if(quiet>=15)break;}
    // Yield so commands can be queued while the render thread remains responsive.
    if(i%4===3)await new Promise<void>(resolve=>setTimeout(resolve,0));
   }
  }finally{"""
new="""  let steps=0,quiet=0,maxSpeed=Infinity;const started=performance.now(),maxSteps=120;
  try{
   // KINETIC's global rigid-connection solve does not need the old 32/8 startup
   // oversolve. Ramp gravity and damping faster, then require an undamped quiet
   // tail before accepting the preload. Normal gameplay solver settings are
   // restored below; this changes preparation cost, not the running timestep.
   for(let i=0;i<maxSteps;i++){
    const gravityScale=Math.min(1,(i+1)/20),extra=Math.max(0,1-(i-20)/25),damping=Math.max(0,1-(i-20)/30);
    ramped.Set(gravity[0]*gravityScale,gravity[1]*gravityScale,gravity[2]*gravityScale);this.system.SetGravity(ramped);
    settings.mNumVelocitySteps=Math.round(velocitySteps+(Math.max(18,velocitySteps)-velocitySteps)*extra);settings.mNumPositionSteps=Math.round(positionSteps+(Math.max(5,positionSteps)-positionSteps)*extra);this.system.SetPhysicsSettings(settings);
    for(const state of bodies){state.motion.SetLinearDamping(state.linear+3*damping);state.motion.SetAngularDamping(state.angular+3*damping);}
    this.world.Step(1/60,1);steps++;onProgress?.(steps,maxSteps);
    if(i>=55){maxSpeed=0;for(const state of bodies)maxSpeed=Math.max(maxSpeed,state.body.GetLinearVelocity().Length(),state.body.GetAngularVelocity().Length()*4);quiet=maxSpeed<.035?quiet+1:0;if(quiet>=15)break;}
    // Yield frequently so mobile browsers can paint progress and service input.
    if(i%3===2)await new Promise<void>(resolve=>setTimeout(resolve,0));
   }
  }finally{"""
assert s.count(old)==1
s=s.replace(old,new)
p.write_text(s)

p=root/'src/physics-worker.ts'
s=p.read_text()
old=""" post({type:'preparing'});
 startupInfo=await sim.settleStartup();"""
new=""" post({type:'preparing'});
 startupInfo=await sim.settleStartup((completed,total)=>post({type:'preparing-progress',completed,total}));"""
assert s.count(old)==1
s=s.replace(old,new)
p.write_text(s)

p=root/'src/simulation-client.ts'
s=p.read_text()
old="""}else if(m.type==='preparing'){window.dispatchEvent(new CustomEvent('simulation-preparing'));}else if(m.type==='ready'){"""
new="""}else if(m.type==='preparing'){this.status.preparing=true;this.status.startupProgress=0;this.status.startupCompleted=0;this.status.startupTotal=1;window.dispatchEvent(new CustomEvent('simulation-preparing'));}else if(m.type==='preparing-progress'){this.status.preparing=true;this.status.startupCompleted=Number(m.completed)||0;this.status.startupTotal=Math.max(1,Number(m.total)||1);this.status.startupProgress=Math.max(0,Math.min(1,this.status.startupCompleted/this.status.startupTotal));window.dispatchEvent(new CustomEvent('simulation-preparing-progress',{detail:m}));}else if(m.type==='ready'){this.status.preparing=false;this.status.startupProgress=1;"""
assert s.count(old)==1
s=s.replace(old,new)
# Persist preparation state so a slow/mobile render loop cannot miss a transient event.
old=" get paused(){return !!this.status.paused}get startup(){return this.status.startup}"
new=" get paused(){return !!this.status.paused}get preparing(){return !!this.status.preparing}get startupProgress(){return this.status.startupProgress??0}get startupCompleted(){return this.status.startupCompleted??0}get startupTotal(){return this.status.startupTotal??1}get startup(){return this.status.startup}"
assert s.count(old)==1
s=s.replace(old,new)
p.write_text(s)

p=root/'src/main.ts'
s=p.read_text()
old="""window.addEventListener('simulation-preparing',()=>{$('status').textContent='GEBÄUDE EINREGELN…';});"""
new="""window.addEventListener('simulation-preparing',()=>{$('status').textContent='GEBÄUDE EINREGELN…';$('timer').textContent='0%';$('progress').style.width='0%';});
window.addEventListener('simulation-preparing-progress',(event:any)=>{const completed=Number(event.detail?.completed??0),total=Math.max(1,Number(event.detail?.total??1)),percent=Math.min(100,Math.round(completed/total*100));$('status').textContent=`GEBÄUDE EINREGELN… ${percent}%`;$('timer').textContent=percent+'%';$('progress').style.width=percent+'%';$('telemetry').textContent=`Vorstabilisierung · ${completed}/${total} Schritte`;});"""
assert s.count(old)==1
s=s.replace(old,new)
p.write_text(s)

# Do not let the regular telemetry frame overwrite the preparation percentage
# with the scenario clock (which correctly remains at zero until preload ends).
p=root/'src/main.ts'
s=p.read_text()
old="if(sim){$('damage-stats').textContent=`${sim.broken} Verbindungen gebrochen · ${sim.fragments}/${fragmentLimit} Trümmer`; $('timer').textContent=sim.elapsed.toFixed(1).padStart(4,'0')+' s';$('progress').style.width=challenge.rules.sandbox?'100%':Math.min(100,sim.elapsed/sim.duration*100)+'%';$('telemetry').textContent=`${sim.broken} failed joints · ${sim.fragments}/${fragmentLimit} debris · peak ${Math.round(sim.peakStress*100)}% · ${sim.physicsMs.toFixed(1)} ms/step · ${Math.round(scene.fps)} fps${sim.rate<speed*.8?' · '+sim.rate.toFixed(2)+'× realtime':''}`;"
new="if(sim?.preparing){const percent=Math.min(100,Math.round(sim.startupProgress*100));$('status').textContent=`GEBÄUDE EINREGELN… ${percent}%`;$('timer').textContent=percent+'%';$('progress').style.width=percent+'%';$('telemetry').textContent=`Vorstabilisierung · ${sim.startupCompleted}/${sim.startupTotal} Schritte`;}else if(sim){$('damage-stats').textContent=`${sim.broken} Verbindungen gebrochen · ${sim.fragments}/${fragmentLimit} Trümmer`; $('timer').textContent=sim.elapsed.toFixed(1).padStart(4,'0')+' s';$('progress').style.width=challenge.rules.sandbox?'100%':Math.min(100,sim.elapsed/sim.duration*100)+'%';$('telemetry').textContent=`${sim.broken} failed joints · ${sim.fragments}/${fragmentLimit} debris · peak ${Math.round(sim.peakStress*100)}% · ${sim.physicsMs.toFixed(1)} ms/step · ${Math.round(scene.fps)} fps${sim.rate<speed*.8?' · '+sim.rate.toFixed(2)+'× realtime':''}`;"
assert s.count(old)==1,(s.count(old),old[:80])
s=s.replace(old,new)
p.write_text(s)


# Benchmark: preparation is real work but not simulated scenario time. Report it
# explicitly instead of leaving the mobile UI at 0 until measurement begins.
p=root/'src/benchmark/suite.ts'
s=p.read_text()
old=" const notify=(stage:string,completed:number)=>progress({variant,repetition,stage,completed,total:scene.ticks});"
new=" const notify=(stage:string,completed:number,total=scene.ticks)=>progress({variant,repetition,stage,completed,total});"
assert s.count(old)==1
s=s.replace(old,new)
old="  notify('Gebäude vorspannen',0);const settleStart=performance.now();await sim.settleStartup();const settleMs=performance.now()-settleStart;check();\n  notify('Aufwärmen',0);const warmupStart=performance.now();for(let i=0;i<WARMUP_TICKS;i++){sim.step(scene.dt);if(i%12===11){await new Promise(r=>setTimeout(r,0));check();}}const warmupMs=performance.now()-warmupStart;"
new="  notify('Gebäude vorspannen',0,120);const settleStart=performance.now();await sim.settleStartup((completed,total)=>notify('Gebäude vorspannen',completed,total));const settleMs=performance.now()-settleStart;check();\n  notify('Aufwärmen',0,WARMUP_TICKS);const warmupStart=performance.now();for(let i=0;i<WARMUP_TICKS;i++){sim.step(scene.dt);if(i%12===11){notify('Aufwärmen',i+1,WARMUP_TICKS);await new Promise(r=>setTimeout(r,0));check();}}const warmupMs=performance.now()-warmupStart;"
assert s.count(old)==1
s=s.replace(old,new)
p.write_text(s)

p=root/'src/benchmark/ui.ts'
s=p.read_text()
old="    const m=e.data;if(m.type==='progress'){const p=m.progress;status(\`${p.variant==='reference'?'Referenz':'Optimiert'} · Paar ${p.repetition}/${repeats} · ${p.stage} ${p.stage==='Messen'?\`${p.completed}/${p.total} Schritte\`:''}\`);const slot=(p.repetition-1)*2+((p.repetition%2===1)===(p.variant==='reference')?0:1);$<HTMLProgressElement>('kb-progress').value=(slot+p.completed/p.total)/(2*repeats)*100;}"
new="    const m=e.data;if(m.type==='progress'){const p=m.progress,ratio=Math.max(0,Math.min(1,p.completed/Math.max(1,p.total))),stageProgress=p.stage==='Gebäude vorspannen'?.15*ratio:p.stage==='Aufwärmen'?.15+.10*ratio:.25+.75*ratio,detail=p.stage==='Messen'?\`${(20*ratio).toFixed(1)} / 20.0 s simuliert\`:\`${p.completed}/${p.total} Schritte\`;status(\`${p.variant==='reference'?'Referenz':'Optimiert'} · Paar ${p.repetition}/${repeats} · ${p.stage} · ${detail}\`);const slot=(p.repetition-1)*2+((p.repetition%2===1)===(p.variant==='reference')?0:1);$<HTMLProgressElement>('kb-progress').value=(slot+stageProgress)/(2*repeats)*100;}"
assert s.count(old)==1
s=s.replace(old,new)
p.write_text(s)

print('Applied mobile startup preload compression and visible progress.')
