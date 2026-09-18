import * as THREE from 'three';

type Slot = { geometry: number; instance: number };
type Pool = { mesh: THREE.BatchedMesh; slots: Slot[]; free: Slot[] };
type Ref = { pool: Pool; slot: Slot; seen: number; pose?: [number, number, number, number, number, number, number] };

// Preserve each shard's actual vertices; share material, geometry buffers and bindings.
// Reserve the largest fracture shape (20 triangles), allowing retired slots to be reused.
export class FragmentBatches {
 readonly root = new THREE.Group();
 readonly stats = {matrixWrites: 0, skippedWrites: 0};
 private pools = new Map<boolean, Pool>();
 private refs = new Map<number, Ref>();
 private generation = 0;
 private matrix = new THREE.Matrix4();
 private position = new THREE.Vector3();
 private rotation = new THREE.Quaternion();
 private unit = new THREE.Vector3(1, 1, 1);
 private readonly poseEpsilon = 1e-5;
 constructor() {
  this.root.visible = false;
  for (const glass of [false, true]) {
   const material = new THREE.MeshStandardMaterial({color:0xffffff,roughness:glass?.18:.95,metalness:glass?.25:0,transparent:glass,opacity:glass?.72:1,flatShading:true,side:THREE.DoubleSide});
   const mesh = new THREE.BatchedMesh(4096, 4096 * 60, 0, material);
   mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
   this.root.add(mesh); this.pools.set(glass, {mesh, slots:[], free:[]});
  }
 }
 private allocate(pool: Pool, geometry: THREE.BufferGeometry) {
  // None of the fracture materials use textures. Rounded rubble alone carries UVs.
  geometry.deleteAttribute('uv');
  let slot = pool.free.pop();
  if (slot) pool.mesh.setGeometryAt(slot.geometry, geometry);
  else {
   const id = pool.mesh.addGeometry(geometry, 60);
   slot = {geometry:id, instance:pool.mesh.addInstance(id)};
   pool.slots.push(slot);
  }
  geometry.dispose();
  pool.mesh.setVisibleAt(slot.instance, true);
  return slot;
 }
 private variedColor(color: THREE.ColorRepresentation, id: number, sourceKind?: string, glass = false) {
  const base = new THREE.Color(color);
  let hash = 2166136261;
  for (const ch of `${sourceKind ?? ''}:${id}`) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  const unit = (hash >>> 0) / 4294967295;
  const spread = glass ? .016 : .045;
  return base.multiplyScalar(1 - spread + unit * spread * 2);
 }
 async prepare(renderer: any, scene: THREE.Scene, camera: THREE.Camera) {
  for (const pool of this.pools.values()) {
   const source = new THREE.BoxGeometry(.1,.1,.1), geometry = source.toNonIndexed();source.dispose();
   const slot = this.allocate(pool, geometry);
   pool.mesh.setColorAt(slot.instance, new THREE.Color(0xffffff));
   pool.mesh.setMatrixAt(slot.instance, this.matrix.identity());
  }
  this.root.visible = true;
  try { await renderer.compileAsync(scene, camera); renderer.render(scene, camera); }
  finally { this.reset(); }
 }
 begin(items: readonly any[]) {
  this.generation++;
  // Reclaim before allocating: a snapshot can replace an entire debris budget at once.
  const live = new Set(items.filter(item=>item.kind==='fragment'&&!item.fractured&&!item.retired).map(item=>item.id));
  for (const [id, ref] of this.refs) if (!live.has(id)) {
   ref.pool.mesh.setVisibleAt(ref.slot.instance, false);
   ref.pool.free.push(ref.slot); this.refs.delete(id);
  }
 }
 update(item: any, geometry: () => THREE.BufferGeometry, color: THREE.ColorRepresentation) {
  let ref = this.refs.get(item.id);
  if (!ref) {
   const pool = this.pools.get(item.sourceKind === 'facade')!;
   ref = {pool, slot:this.allocate(pool, geometry()), seen:this.generation};
   pool.mesh.setColorAt(ref.slot.instance, this.variedColor(color, item.id, item.sourceKind, item.sourceKind === 'facade'));
   this.refs.set(item.id, ref);
  }
  ref.seen = this.generation;
  const p = item.body.GetRenderPosition?.() ?? item.body.GetPosition();
  const q = item.body.GetRenderRotation?.() ?? item.body.GetRotation();
  const previous = ref.pose;
  const x=p.GetX(),y=p.GetY(),z=p.GetZ(),qx=q.GetX(),qy=q.GetY(),qz=q.GetZ(),qw=q.GetW();
  if (previous && Math.abs(previous[0]-x)<=this.poseEpsilon && Math.abs(previous[1]-y)<=this.poseEpsilon && Math.abs(previous[2]-z)<=this.poseEpsilon && Math.abs(previous[3]-qx)<=this.poseEpsilon && Math.abs(previous[4]-qy)<=this.poseEpsilon && Math.abs(previous[5]-qz)<=this.poseEpsilon && Math.abs(previous[6]-qw)<=this.poseEpsilon) {
   this.stats.skippedWrites++;
   return;
  }
  this.position.set(x, y, z);
  this.rotation.set(qx, qy, qz, qw);
  this.matrix.compose(this.position, this.rotation, this.unit);
  ref.pool.mesh.setMatrixAt(ref.slot.instance, this.matrix);
  if (previous) { previous[0]=x; previous[1]=y; previous[2]=z; previous[3]=qx; previous[4]=qy; previous[5]=qz; previous[6]=qw; }
  else ref.pose = [x,y,z,qx,qy,qz,qw];
  this.stats.matrixWrites++;
 }
 end() {
  for (const [id, ref] of this.refs) if (ref.seen !== this.generation) {
   ref.pool.mesh.setVisibleAt(ref.slot.instance, false);
   ref.pool.free.push(ref.slot); this.refs.delete(id);
  }
 }
 reset() {
  this.refs.clear();
  for (const pool of this.pools.values()) {
   for (const slot of pool.slots) pool.mesh.setVisibleAt(slot.instance, false);
   pool.free = [...pool.slots];
  }
 }
}
