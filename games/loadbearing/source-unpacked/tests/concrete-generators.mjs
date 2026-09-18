import {build} from 'esbuild';
import assert from 'node:assert/strict';
await build({stdin:{contents:"export {generateDemolitionBuilding,BUILDING_STYLES} from './src/procedural-buildings';export {validateBlueprint} from './src/catalog';export {isConcrete,materialProperties} from './src/concrete-materials';export {SHOWCASES,showcasePieces} from './src/showcases';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'artifacts/concrete-generators.mjs'});
const {generateDemolitionBuilding,BUILDING_STYLES,validateBlueprint,isConcrete,materialProperties,SHOWCASES,showcasePieces}=await import('../artifacts/concrete-generators.mjs');
assert.deepEqual(materialProperties({}),{concreteStrength:1,reinforcement:1});
for(const style of BUILDING_STYLES)for(const count of [100,751,1000]){
 const b=generateDemolitionBuilding(count,90210,style.id);
 assert.ok(validateBlueprint({scenario:'sandbox',pieces:b.pieces}),style.id);
 assert.ok(b.pieces.length<=count);
 assert.deepEqual(b.pieces,generateDemolitionBuilding(count,90210,style.id).pieces);
 for(const p of b.pieces){if(isConcrete(p.kind))assert.ok(Number.isFinite(p.concreteStrength)&&Number.isFinite(p.reinforcement));else assert.equal(p.concreteStrength,undefined);}
 const roundTrip=JSON.parse(JSON.stringify(b.pieces));assert.deepEqual(roundTrip,b.pieces);
}
for(const s of SHOWCASES){const ps=showcasePieces(s.id);assert.ok(ps.filter(p=>isConcrete(p.kind)).every(p=>p.concreteStrength!==undefined));}
const piece={id:1,kind:'slab',rotation:0,p:[0,4,0]};
assert.ok(validateBlueprint({scenario:'sandbox',pieces:[piece]}));
for(const value of [NaN,Infinity,-1,3,'1'])assert.equal(validateBlueprint({scenario:'sandbox',pieces:[{...piece,concreteStrength:value}]}),false);
console.log('PASS legacy defaults, validation, all generator styles, showcases, deterministic profiles and save round trips');
