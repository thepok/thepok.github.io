import type { V3 } from './catalog';
import { rotateByQuaternion } from './fracture';
type Frame={position:V3;x:V3;y:V3};
type OriginalFrames={a:any;b:any;fa:Frame;fb:Frame};
const frames=new WeakMap<object,OriginalFrames>();
function frame(body:any,point:V3):Frame{
 const q=body.GetRotation(),inverse=[-q.GetX(),-q.GetY(),-q.GetZ(),q.GetW()];
 const com=body.GetCenterOfMassPosition(),delta:V3=[point[0]-com.GetX(),point[1]-com.GetY(),point[2]-com.GetZ()];
 return {position:rotateByQuaternion(delta,inverse),x:rotateByQuaternion([1,0,0],inverse),y:rotateByQuaternion([0,1,0],inverse)};
}
/** Same bodies, sockets and joint graph. Specialize only fully fixed large sandbox joints. */
export function createStructuralConstraint(sim:any,a:any,b:any,point:V3,pinned:boolean){
 const J=sim.J,useFixed=!pinned&&sim.rules.sandbox&&sim.pieces.length>=800&&sim.rules.optimizedPhysics!==false&&sim.rules.fixedConstraints!==false&&!!J.FixedConstraint;
 const settings=pinned?new J.PointConstraintSettings():useFixed?new J.FixedConstraintSettings():new J.SixDOFConstraintSettings();
 if(pinned||useFixed){if(useFixed)settings.mAutoDetectPoint=false;settings.mPoint1.Set(...point);settings.mPoint2.Set(...point);}
 else{for(let axis=0;axis<6;axis++)settings.MakeFixedAxis(axis);settings.mPosition1.Set(...point);settings.mPosition2.Set(...point);}
 const constraint=J.castObject(settings.Create(a,b),pinned?J.PointConstraint:useFixed?J.FixedConstraint:J.SixDOFConstraint);
 sim.system.AddConstraint(constraint);J.destroy(settings);
 if(useFixed)frames.set(constraint,{a,b,fa:frame(a,point),fb:frame(b,point)});
 return constraint;
}
/** Restore the ORIGINAL material/socket frames, not a new weld in the bent pose.
 * Conversion loses one warm start; existing damage thresholds/friction stay intact. */
export function prepareJointYield(sim:any,joint:any){
 const old=joint.constraint,state=frames.get(old);if(!state)return;
 const J=sim.J,settings=new J.SixDOFConstraintSettings();settings.mSpace=J.EConstraintSpace_LocalToBodyCOM;
 for(let axis=0;axis<6;axis++)settings.MakeFixedAxis(axis);
 settings.mPosition1.Set(...state.fa.position);settings.mPosition2.Set(...state.fb.position);
 settings.mAxisX1.Set(...state.fa.x);settings.mAxisY1.Set(...state.fa.y);
 settings.mAxisX2.Set(...state.fb.x);settings.mAxisY2.Set(...state.fb.y);
 const next=J.castObject(settings.Create(state.a,state.b),J.SixDOFConstraint);J.destroy(settings);
 next.SetConstraintPriority(old.GetConstraintPriority());sim.system.AddConstraint(next);sim.system.RemoveConstraint(old);
 frames.delete(old);joint.constraint=next;sim.fixedJointUpgrades=(sim.fixedJointUpgrades??0)+1;
}
