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
    if(i>=55){maxSpeed=0;for(const state of bodies)maxSpeed=Math.max(maxSpeed,state.body.GetLinearVelocity().Length(),state.body.GetAngularVelocity().Length()*4);quiet=maxSpeed<.035?quiet+1:0;if(quiet>=12)break;}
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
new="""}else if(m.type==='preparing'){window.dispatchEvent(new CustomEvent('simulation-preparing'));}else if(m.type==='preparing-progress'){window.dispatchEvent(new CustomEvent('simulation-preparing-progress',{detail:m}));}else if(m.type==='ready'){"""
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

print('Applied mobile startup preload compression and visible progress.')
