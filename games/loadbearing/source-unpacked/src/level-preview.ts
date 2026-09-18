import * as THREE from 'three';
import {PARTS} from './catalog';
import {starterPieces,type CampaignLevel} from './campaign';
export function createLevelPreview(host:HTMLElement){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.replaceChildren(renderer.domElement);const scene=new THREE.Scene(),group=new THREE.Group();scene.add(group,new THREE.HemisphereLight('#effaff','#6d8e80',3));const sun=new THREE.DirectionalLight('#fff2d9',3);sun.position.set(10,20,8);scene.add(sun);const camera=new THREE.PerspectiveCamera(40,1,.1,500);
 return (level:CampaignLevel)=>{group.traverse((o:any)=>{o.geometry?.dispose();o.material?.dispose();});group.clear();for(const piece of starterPieces(level)){const root=new THREE.Group();root.position.set(...piece.p);root.rotation.y=piece.rotation*Math.PI/2;for(const segment of PARTS[piece.kind].segments){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...segment.size),new THREE.MeshStandardMaterial({color:PARTS[piece.kind].color,roughness:.85}));mesh.position.set(...segment.center);root.add(mesh);}group.add(root);}
 const box=new THREE.Box3().setFromObject(group),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()),radius=Math.max(8,size.length());const grid=new THREE.GridHelper(Math.max(16,Math.ceil(radius)),16,'#74a7bd','#a5c9d9');grid.position.set(center.x,box.min.y-.1,center.z);group.add(grid);const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();camera.position.copy(center).add(new THREE.Vector3(.7,.7,1).normalize().multiplyScalar(radius*1.25));camera.lookAt(center);renderer.render(scene,camera);
 };
}
