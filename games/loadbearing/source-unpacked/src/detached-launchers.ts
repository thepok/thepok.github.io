import { ArrowHelper, Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';
import type { V3 } from './catalog';

/** Fixed world-space muzzles. Markers have no colliders and never follow the camera. */
export class DetachedLaunchers {
 readonly group=new Group();
 private points:{position:Vector3;direction:Vector3}[]=[];
 get count(){return this.points.length;}
 add(position:Vector3,direction:Vector3){
  const p=position.clone(),d=direction.clone().normalize();
  this.points.push({position:p,direction:d});
  const marker=new Group();marker.position.copy(p);
  marker.add(new ArrowHelper(d,new Vector3(),2.4,0x64bfd2,.55,.3));
  marker.add(new Mesh(new SphereGeometry(.22,8,6),new MeshBasicMaterial({color:0x64bfd2,wireframe:true,transparent:true,opacity:.65})));
  this.group.add(marker);
 }
 update(camera:Vector3){for(const marker of this.group.children)marker.visible=marker.position.distanceToSquared(camera)>36;}
 shots(speed:number){return this.points.map(({position,direction})=>({position:position.toArray() as V3,velocity:direction.clone().multiplyScalar(speed).toArray() as V3}));}
 clear(){
  this.group.traverse(object=>{const mesh=object as Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material)for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])material.dispose();});
  this.group.clear();this.points=[];
 }
}
