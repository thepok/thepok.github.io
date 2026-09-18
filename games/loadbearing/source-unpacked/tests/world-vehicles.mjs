import assert from 'node:assert/strict';
import { build } from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts'; export {VEHICLE_PRESETS} from './src/vehicle-blueprint.ts'; export {showcasePieces} from './src/showcases.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/world-vehicles-test.mjs'});
const {Simulation,loadPhysics,VEHICLE_PRESETS,showcasePieces}=await import('../artifacts/world-vehicles-test.mjs?'+Date.now());
const J=await loadPhysics(),parts=structuredClone(VEHICLE_PRESETS[0].parts),sim=new Simulation(J,showcasePieces('grand-hall'),'sandbox',1,{sandbox:true,fragmentLimit:600});
const spec=(id,x)=>({id,name:`car-${id}`,parts:structuredClone(parts),position:[x,0,20],rotation:0});
const a=sim.spawnWorldVehicle(spec(101,-8)),b=sim.spawnWorldVehicle(spec(102,8));
const yaw=Math.PI/2,yawCar=sim.spawnWorldVehicle({...spec(103,28),rotation:yaw});
const yawWheels=sim.items.filter(i=>i.vehicleId===103&&i.kind==='vehicle-wheel');
assert.equal(yawWheels.length,parts.filter(p=>p.kind==='wheel').length);
for(const item of yawWheels){const part=item.vehiclePart,p=item.body.GetPosition(),c=Math.cos(yaw),s=Math.sin(yaw),expected=[28+c*part.p[0]+s*part.p[2],part.p[1],20-s*part.p[0]+c*part.p[2]];assert.ok(Math.hypot(p.GetX()-expected[0],p.GetY()-expected[1],p.GetZ()-expected[2])<1e-5,'yawed wheel offset follows chassis');}
assert.notEqual(a.chassisId,b.chassisId);assert.equal(sim.worldVehicleStates.length,3);assert.equal(sim.worldVehicleStates.find(v=>v.id===101).mode,'parked');
assert.equal(sim.worldVehicleInput(101,{throttle:1,steer:.2}),false);sim.setWorldVehicleMode(101,'drive');assert.equal(sim.worldVehicleInput(101,{throttle:1,steer:.2}),true);sim.setWorldVehicleMode(102,'drive');assert.equal(sim.worldVehicleStates.find(v=>v.id===101).mode,'parked');
sim.setWorldVehicleMode(102,'attack',[0,3,0]);for(let i=0;i<20;i++)sim.step(1/60);assert.equal(sim.worldVehicleStates.find(v=>v.id===102).mode,'attack');
sim.setWorldVehicleMode(103,'drive');sim.worldVehicleInput(103,{throttle:1,steer:0,brake:false});const yawStart=sim.worldVehicleStates.find(v=>v.id===103).position;for(let i=0;i<240;i++)sim.step(1/60);const yawState=sim.worldVehicleStates.find(v=>v.id===103);assert.ok(Math.hypot(yawState.position[0]-yawStart[0],yawState.position[2]-yawStart[2])>3,'yawed vehicle actually drives');assert.ok(Math.abs(yawState.position[0]-yawStart[0])>Math.abs(yawState.position[2]-yawStart[2])*2,'90-degree vehicle drives along rotated forward axis');
assert.throws(()=>sim.replaceWorldVehicle({...spec(102,8),parts:[{id:1,kind:'frame',p:[0,0,0]}]}));assert.equal(sim.worldVehicleStates.length,3);sim.removeWorldVehicle(101);assert.equal(sim.worldVehicleStates.length,2);assert.ok(sim.items.some(i=>i.id>0&&!i.fractured));sim.dispose();console.log('PASS world vehicle fleet spawn, directed input, yawed drive, autopilot, replace validation, sibling preservation, disposal');
