import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
await build({stdin:{contents:"export {generateDemolitionBuilding} from './src/procedural-buildings.ts'",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'artifacts/art-deco-generator.mjs'});
const {generateDemolitionBuilding}=await import('../artifacts/art-deco-generator.mjs');
for(const target of [750,751,800,1000])for(const seed of [72000,90210,42]){
 const b=generateDemolitionBuilding(target,seed,'art-deco'),cores=b.pieces.filter(p=>p.kind==='core'),lines=new Map();
 for(const p of cores){const key=`${p.p[0]}:${p.p[2]}`;if(!lines.has(key))lines.set(key,[]);lines.get(key).push(p.p[1]);}
 assert.equal(lines.size,target>750?3:1);
 assert.ok(b.pieces.length<=target);
 for(const ys of lines.values())assert.deepEqual(ys,Array.from({length:ys.length},(_,i)=>i*4),'Each core must be continuous from ground');
 for(const core of cores)assert.ok(b.pieces.some(p=>['slab','stairwell'].includes(p.kind)&&p.p[0]===core.p[0]&&p.p[2]===core.p[2]+2&&p.p[1]===core.p[1]+4),'Core must end at a supported floor');
 if(target>750){const lengths=[...lines.values()].map(a=>a.length).sort((a,b)=>a-b);assert.equal(lengths[0],lengths[1]);assert.ok(lengths[2]>lengths[1]);}
 console.log(JSON.stringify({target,seed,parts:b.pieces.length,coreFloors:[...lines.values()].map(a=>a.length)}));
 if(target===1000&&seed===72000)await writeFile('artifacts/art-deco-cores-fixture.json',JSON.stringify({scenario:'sandbox',pieces:b.pieces}));
}
