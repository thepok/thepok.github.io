/** Same public-getter values, batched between completed physics steps. */
export class NativeQueryCache{
 private native:any;private bodyRefs:any[]=[];private bodySlots:number[]=[];private jointRefs:any[]=[];
 readonly enabled:boolean;
 constructor(private J:any,enabled=true){this.enabled=enabled&&!!J.LoadBearingQueries;if(this.enabled)this.native=new J.LoadBearingQueries();}
 private isNative(value:any){return value&&Number.isSafeInteger(this.J.getPointer(value))&&this.J.getPointer(value)>0;}
 lambdas(joints:any[]):Float32Array|undefined{
  if(!this.native)return undefined;
  if(joints.length!==this.jointRefs.length||joints.some((j,i)=>j.constraint!==this.jointRefs[i])){
   if(joints.some(j=>!this.isNative(j.constraint)))return undefined;
   this.native.ClearJoints();this.jointRefs=joints.map(j=>j.constraint);
   for(const constraint of this.jointRefs)this.native.AddJoint(constraint);
  }
  this.native.CaptureLambdas();return new Float32Array(this.J.HEAPF32.buffer,this.native.GetLambdaAddress(),joints.length*4);
 }
 writePoses(items:any[],out:Float32Array){
  let values:Float32Array|undefined;
  if(this.native){
   if(items.length!==this.bodyRefs.length||items.some((item,i)=>item.body!==this.bodyRefs[i])){
    this.native.ClearBodies();this.bodyRefs=items.map(item=>item.body);this.bodySlots=[];let slot=0;
    for(const body of this.bodyRefs){if(this.isNative(body)){this.native.AddBody(body);this.bodySlots.push(slot++);}else this.bodySlots.push(-1);}
   }
   this.native.CapturePoses();values=new Float32Array(this.J.HEAPF32.buffer,this.native.GetPoseAddress(),this.native.GetBodyCount()*14);
  }
  for(let i=0;i<items.length;i++){
   const item=items[i],o=i*14,slot=values?this.bodySlots[i]:-1;
   if(values&&slot>=0){for(let k=0;k<14;k++)out[o+k]=values[slot*14+k];if(item.flying)out[o+10]=1;}
   else{
    // Historic retired parts use immutable JS poses, never recycled native pointers.
    const p=item.body.GetPosition(),q=item.body.GetRotation(),v=item.body.GetLinearVelocity(),w=item.body.GetAngularVelocity();
    out[o]=p.GetX();out[o+1]=p.GetY();out[o+2]=p.GetZ();out[o+3]=q.GetX();out[o+4]=q.GetY();out[o+5]=q.GetZ();out[o+6]=q.GetW();
    out[o+7]=v.GetX();out[o+8]=v.GetY();out[o+9]=v.GetZ();out[o+10]=(item.flying||item.body.IsActive?.())?1:0;out[o+11]=w.GetX();out[o+12]=w.GetY();out[o+13]=w.GetZ();
   }
  }
 }
 dispose(){if(this.native){this.J.destroy(this.native);this.native=undefined;}this.bodyRefs=[];this.bodySlots=[];this.jointRefs=[];}
}
