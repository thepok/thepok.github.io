import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts',{recursive:true});
await build({stdin:{contents:"export {generateDemolitionBuilding} from './src/procedural-buildings.ts'; export {validateBlueprint} from './src/catalog.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'artifacts/procedural-buildings.mjs'});
const {generateDemolitionBuilding,validateBlueprint}=await import('../artifacts/procedural-buildings.mjs?'+Date.now());
for(const target of [24,100,500,750,1000]){
 const result=generateDemolitionBuilding(target,12345+target,'classic');
 assert.equal(result.pieces.length,target);assert.equal(result.target,target);assert.ok(validateBlueprint({scenario:'sandbox',pieces:result.pieces}));assert.ok(result.cost<=1200000);assert.ok(result.height>=8&&result.height<=80);
 assert.equal(new Set(result.pieces.map(p=>`${p.kind}:${p.p.join(',')}:${p.rotation}`)).size,target,'no duplicate parts');
 console.log('PASS procedural',target,'parts',result.name,result.height+' m','$'+result.cost.toLocaleString());
}
for(const target of [100,500,1000])for(let seed=1;seed<=12;seed++){
 const {pieces}=generateDemolitionBuilding(target,seed,'classic');let partitions=0;
 for(const y of new Set(pieces.filter(p=>p.kind==='slab').map(p=>p.p[1]-4))){
  const cells=new Set(pieces.filter(p=>p.kind==='slab'&&p.p[1]===y+4).map(p=>`${p.p[0]}:${p.p[2]-2}`));
  const walls=new Set(pieces.filter(p=>(p.kind==='wall'||p.kind==='facade')&&p.p[1]===y).map(p=>`${p.p[0]}:${p.p[2]}:${p.rotation}`));
  const neighbors=new Map([...cells].map(k=>[k,[]]));
  for(const key of cells){const [x,z]=key.split(':').map(Number);for(const [other,edge] of [[`${x+4}:${z}`,`${x+4}:${z}:3`],[`${x}:${z+4}`,`${x}:${z+4}:0`]])if(cells.has(other)){
   if(walls.has(edge)){partitions++;continue;}neighbors.get(key).push(other);neighbors.get(other).push(key);
  }}
  const seen=new Set(),queue=[[...cells][0]];while(queue.length){const k=queue.pop();if(seen.has(k))continue;seen.add(k);queue.push(...neighbors.get(k));}
  assert.equal(seen.size,cells.size,'interior partitions must leave connected passages');
 }
 assert.ok(partitions>0,`${target} parts should include interior walls`);
}
console.log('PASS interior walls and connected passages across 36 generated buildings');
