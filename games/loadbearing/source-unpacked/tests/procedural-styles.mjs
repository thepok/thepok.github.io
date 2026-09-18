import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts',{recursive:true});
await build({stdin:{contents:"export {BUILDING_STYLES,generateDemolitionBuilding} from './src/procedural-buildings.ts'; export {validateBlueprint,ports} from './src/catalog.ts'; export {Simulation,loadPhysics} from './src/physics.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/procedural-styles.mjs'});
const {BUILDING_STYLES,generateDemolitionBuilding,validateBlueprint,ports,Simulation,loadPhysics}=await import('../artifacts/procedural-styles.mjs?'+Date.now());
const styles=BUILDING_STYLES.filter(s=>s.id!=='classic').map(s=>s.id);
assert.deepEqual(styles,['art-deco','refinery','triumph','brutalist','pagoda','skybridge']);
const key=v=>v.map(n=>n.toFixed(3)).join(',');
function assertConnected(pieces,style){
 const byPort=new Map();pieces.forEach((p,i)=>ports(p).forEach(v=>{const k=key(v);if(!byPort.has(k))byPort.set(k,[]);byPort.get(k).push(i);}));
 const graph=pieces.map(()=>new Set());for(const ids of byPort.values())for(const a of ids)for(const b of ids)if(a!==b)graph[a].add(b);
 const roots=pieces.map((p,i)=>p.kind==='foundation'?i:-1).filter(i=>i>=0),seen=new Set(roots),q=[...roots];while(q.length){for(const n of graph[q.pop()])if(!seen.has(n)){seen.add(n);q.push(n);}}
 assert.equal(seen.size,pieces.length,`${style} has unsupported/floating parts (${pieces.length-seen.size})`);
}
for(const style of styles)for(const target of [24,100,500,1000]){
 const a=generateDemolitionBuilding(target,4000+target,style),b=generateDemolitionBuilding(target,4000+target,style);
 assert.ok(a.pieces.length>=Math.ceil(target*.85)&&a.pieces.length<=target,`${style} count ${a.pieces.length} outside bounded budget`);assert.equal(a.target,target);assert.ok(validateBlueprint({scenario:'sandbox',pieces:a.pieces}));assert.equal(JSON.stringify(a.pieces),JSON.stringify(b.pieces));
 assert.equal(new Set(a.pieces.map(p=>`${p.kind}:${p.p.join(',')}:${p.rotation}`)).size,a.pieces.length,`${style} duplicate parts`);assert.ok(a.height>=8&&a.height<=80);assertConnected(a.pieces,style);
 if(target===500){const variants=new Set([1,2,3,4,5,6,7,8].map(seed=>JSON.stringify(generateDemolitionBuilding(target,9000+seed,style).pieces)));assert.ok(variants.size>1,`${style} ignores seed across eight samples`);}
 console.log('PASS style',style,target,'height',a.height);
}
const J=await loadPhysics();
for(const style of styles){const g=generateDemolitionBuilding(500,72000,style),sim=new Simulation(J,g.pieces,'sandbox',1,{sandbox:true,fragmentLimit:156});for(let i=0;i<120;i++)sim.step();assert.equal(sim.broken,0,`${style} broke during gravity stability`);assert.ok(sim.items.every(item=>{const p=item.body.GetPosition();return [p.GetX(),p.GetY(),p.GetZ()].every(Number.isFinite);}));console.log('PASS physics',style,'joints',sim.joints.length);sim.dispose();}
console.log('PASS six procedural styles invariants and 120-step physics stability');
