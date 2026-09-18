import assert from 'node:assert/strict';
import { build } from 'esbuild';

await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts'; export {materialProperties,isConcrete} from './src/concrete-materials.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/concrete-materials-physics.mjs'});
const {Simulation,loadPhysics,materialProperties,isConcrete}=await import('../artifacts/concrete-materials-physics.mjs?'+Date.now());
const J=await loadPhysics();
assert.deepEqual(materialProperties({}),{concreteStrength:1,reinforcement:1});
assert.deepEqual(materialProperties({concreteStrength:9,reinforcement:-1}),{concreteStrength:2.5,reinforcement:0});
assert.equal(isConcrete('deck'),false); assert.equal(isConcrete('core'),true);

const pieces=[{id:1,kind:'wall',p:[0,0,0],rotation:0}];
let baselineForce;
function make(fields={}) { const sim=new Simulation(J,pieces.map(p=>({...p,...fields})),'sandbox',1,{sandbox:true,fragmentLimit:300}); const a=sim.items[0],b=sim.dynamicBox([2,'wall'],[0,2,0],[1,1,1],100); Object.assign(b,fields); sim.join(a,b,[0,.5,0]); return sim; }
const baseline=make();
try {
 const wall=baseline.items.find(i=>i.id===1); assert.equal(wall.concreteStrength,1); assert.equal(wall.reinforcement,1);
 const joint=baseline.joints.find(j=>j.b); assert.ok(joint && joint.force>0);
 baselineForce=joint.force;
 const a=baseline.items[0],b=baseline.items[1]; baseline.createRebar(a,b,[0,.5,0],[0,.5,0],.12,140000); assert.equal(baseline.rebars.length,1); assert.equal(baseline.rebars[0].strength,140000);
 baseline.fracture(wall); assert.equal(wall.fractured,true); assert.ok(baseline.items.filter(i=>i.kind==='fragment').every(i=>i.concreteStrength===1 && i.reinforcement===1));
} finally { baseline.dispose(); }

const strong=make({concreteStrength:2.5,reinforcement:2.5});
try {
 const wall=strong.items.find(i=>i.id===1),joint=strong.joints.find(j=>j.b); assert.ok(joint); assert.equal(joint.force,baselineForce*2.5);
 const a=strong.items[0],b=strong.items[1]; strong.createRebar(a,b,[0,.5,0],[0,.5,0],.12,140000); assert.equal(strong.rebars.length,1); assert.equal(strong.rebars[0].strength,350000); assert.equal(strong.rebars[0].limit,.3);
} finally { strong.dispose(); }

const noSteel=make({reinforcement:0});
try {
 const wall=noSteel.items.find(i=>i.id===1); noSteel.createRebar(wall,noSteel.items[1],[0,.5,0],[0,.5,0],.12,140000); assert.equal(noSteel.rebars.length,0,'zero reinforcement must not create rebars');
} finally { noSteel.dispose(); }
const weak=make({concreteStrength:.25}); try { const wall=weak.items[0],p=wall.body.GetCenterOfMassPosition(); weak.impactFracture(wall,[p.GetX(),p.GetY(),p.GetZ()],800000); assert.equal(wall.fractured,true); } finally { weak.dispose(); }
const tough=make({concreteStrength:2.5}); try { const wall=tough.items[0],p=wall.body.GetCenterOfMassPosition(); tough.impactFracture(wall,[p.GetX(),p.GetY(),p.GetZ()],800000); assert.equal(wall.fractured,undefined); } finally { tough.dispose(); }
function fractureCounts(reinforcement){
 const sim=new Simulation(J,[{...pieces[0],concreteStrength:1.5,reinforcement}],'sandbox',1,{sandbox:true,fragmentLimit:300});
 try{sim.fracture(sim.items[0]);const fragments=sim.items.filter(i=>i.kind==='fragment');assert.ok(fragments.length>0);assert.ok(fragments.every(i=>i.concreteStrength===1.5&&i.reinforcement===reinforcement));return {bodies:sim.bodyList.length,fragments:fragments.length,links:sim.rebars.filter(r=>!r.broken).length};}finally{sim.dispose();}
}
const regular=fractureCounts(1),heavy=fractureCounts(2.5),plain=fractureCounts(0);
assert.ok(regular.links>0);assert.deepEqual(heavy,regular,'Heavy steel must not add bodies or constraints');assert.equal(plain.links,0);assert.equal(plain.bodies,regular.bodies);
console.log('PASS concrete material behavior and fixed fracture cost', {regular,heavy,plain});
