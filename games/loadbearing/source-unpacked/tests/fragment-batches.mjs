import assert from 'node:assert/strict';
import * as THREE from 'three';
import {FragmentBatches} from '../src/fragment-batches.ts';

const batches=new FragmentBatches();
const rotation={GetX:()=>0,GetY:()=>0,GetZ:()=>0,GetW:()=>1};
const item=id=>{const position={x:3,y:5,z:7};return {id,kind:'fragment',sourceKind:'slab',position,body:{GetPosition:()=>({GetX:()=>position.x,GetY:()=>position.y,GetZ:()=>position.z}),GetRotation:()=>rotation}}};
function geometry(){const indexed=new THREE.BoxGeometry(.8,.3,.7),g=indexed.toNonIndexed();indexed.dispose();return g;}
const source=geometry(),expected=Array.from(source.attributes.position.array);source.dispose();
let items=Array.from({length:3000},(_,i)=>item(-i-1));
const pool=batches.pools.get(false);
batches.begin(items);for(const fragment of items)batches.update(fragment,geometry,'#ab9080');batches.end();
assert.equal(batches.refs.size,3000);
assert.equal(pool.slots.length,3000,'replace entire budget without growing allocation');
const ref=batches.refs.get(items[0].id),range=pool.mesh.getGeometryRangeAt(ref.slot.geometry),positions=pool.mesh.geometry.attributes.position;
assert.deepEqual(Array.from(positions.array.slice(range.vertexStart*3,(range.vertexStart+36)*3)),expected,'exact original vertices retained');
const matrix=new THREE.Matrix4();pool.mesh.getMatrixAt(ref.slot.instance,matrix);assert.deepEqual(new THREE.Vector3().setFromMatrixPosition(matrix).toArray(),[3,5,7]);
const color=new THREE.Color();pool.mesh.getColorAt(ref.slot.instance,color);const base=new THREE.Color('#ab9080');
for(const channel of ['r','g','b'])assert.ok(Math.abs(color[channel]-base[channel])<=.05,`bounded ${channel} variation`);
const firstColor=color.getHexString();

// 120 unchanged frames should all be rejected by the pose cache.
const writesBefore=batches.stats.matrixWrites;
const optimizedStart=performance.now();
for(let frame=0;frame<120;frame++){batches.begin(items);for(const fragment of items)batches.update(fragment,geometry,'#ab9080');batches.end();}
const optimizedMs=performance.now()-optimizedStart;
assert.equal(batches.stats.matrixWrites,writesBefore,'unchanged fragments do not write matrices');
assert.equal(batches.stats.skippedWrites,3000*120);

// A moved body wakes exactly one fragment and updates it once.
items[17].position.x=4;
batches.begin(items);for(const fragment of items)batches.update(fragment,geometry,'#ab9080');batches.end();
assert.equal(batches.stats.matrixWrites,writesBefore+1,'movement writes one matrix');
items[17].position.x=3;

// Reclaim, reuse, and reset must force the first upload for a new reference.
batches.begin([]);batches.end();
const recycled=item(-900001);batches.begin([recycled]);batches.update(recycled,geometry,'#ab9080');batches.end();
assert.equal(batches.stats.matrixWrites,writesBefore+2,'recycled slot uploads');
batches.reset();const resetItem=item(items[0].id);batches.begin([resetItem]);batches.update(resetItem,geometry,'#ab9080');
assert.equal(batches.stats.matrixWrites,writesBefore+3,'reset slot uploads');
const resetColor=new THREE.Color();batches.pools.get(false).mesh.getColorAt(batches.refs.get(resetItem.id).slot.instance,resetColor);assert.equal(resetColor.getHexString(),firstColor,'color variation is deterministic');

// Compare the cached path with the former update work, including lifecycle, lookups,
// body getters, pose assignment, compose, and setMatrixAt. Warm each path, then median 3.
batches.begin(items);for(const fragment of items)batches.update(fragment,geometry,'#ab9080');batches.end();
const runCached=()=>{for(let frame=0;frame<120;frame++){batches.begin(items);for(const fragment of items)batches.update(fragment,geometry,'#ab9080');batches.end();}};
const baselineMatrix=new THREE.Matrix4(),baselinePosition=new THREE.Vector3(),baselineRotation=new THREE.Quaternion(),unit=new THREE.Vector3(1,1,1);
const runBaseline=()=>{for(let frame=0;frame<120;frame++){batches.begin(items);for(const fragment of items){const ref=batches.refs.get(fragment.id),p=fragment.body.GetPosition(),q=fragment.body.GetRotation();ref.seen=batches.generation;baselinePosition.set(p.GetX(),p.GetY(),p.GetZ());baselineRotation.set(q.GetX(),q.GetY(),q.GetZ(),q.GetW());baselineMatrix.compose(baselinePosition,baselineRotation,unit);ref.pool.mesh.setMatrixAt(ref.slot.instance,baselineMatrix);}batches.end();}};
const medianMs=fn=>{fn();const values=[];for(let i=0;i<3;i++){const start=performance.now();fn();values.push(performance.now()-start);}values.sort((a,b)=>a-b);return values[1];};
const cachedMs=medianMs(runCached),baselineMs=medianMs(runBaseline);
console.log(`TIMING unchanged 3000x120 median3: cached ${cachedMs.toFixed(1)}ms, former ${baselineMs.toFixed(1)}ms`);

batches.begin([]);batches.end();assert.equal(batches.refs.size,0);
for(const slot of batches.pools.get(false).slots)assert.equal(batches.pools.get(false).mesh.getVisibleAt(slot.instance),false);
batches.reset();assert.equal(batches.pools.get(false).free.length,3000);
console.log('PASS exact geometry, bounded deterministic color, cached pose writes, wake/recycle/reset uploads and cleanup');
