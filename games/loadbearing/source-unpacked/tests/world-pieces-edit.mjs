import assert from 'node:assert/strict';
import { build } from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts'; export {showcasePieces} from './src/showcases.ts'; export {addWorldPieces,removeWorldPieces,validateWorldPieceEdit} from './src/structural-edit.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/world-pieces-edit-test.mjs'});
const {Simulation,loadPhysics,showcasePieces,addWorldPieces,removeWorldPieces,validateWorldPieceEdit}=await import('../artifacts/world-pieces-edit-test.mjs?'+Date.now());
const J=await loadPhysics(),base=showcasePieces('grand-hall'),sim=new Simulation(J,base,'sandbox',1,{sandbox:true,fragmentLimit:600});
const id=Math.max(...base.map(p=>p.id))+1000,foundation={id,kind:'foundation',p:[100,0,100],rotation:0},column={id:id+1,kind:'column',p:[100,4,100],rotation:0};
const before=sim.items.length;addWorldPieces(sim,[foundation,column]);assert.equal(sim.items.length,before+2);assert.ok(sim.items.some(i=>i.id===id));
assert.throws(()=>validateWorldPieceEdit(sim,[{...foundation,id:id+2,p:[NaN,0,0]}]));assert.equal(sim.items.length,before+2);
const fleetBefore=sim.items.filter(i=>i.vehicleId).length;removeWorldPieces(sim,[id]);assert.ok(sim.items.find(i=>i.id===id)?.retired);assert.equal(sim.items.filter(i=>i.vehicleId).length,fleetBefore);assert.ok(sim.items.some(i=>i.id===id+1&&!i.retired));sim.dispose();console.log('PASS world piece validation, add/remove, sibling preservation, and native disposal');
