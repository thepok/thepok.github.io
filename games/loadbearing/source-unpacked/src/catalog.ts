export type V3 = [number, number, number];
export type Kind = 'deck' | 'girder' | 'truss' | 'column' | 'brace' | 'slab' | 'wall' | 'foundation' | 'facade' | 'doorway' | 'stairwell' | 'stair' | 'core';
export type Scenario = 'bridge' | 'earthquake' | 'wind' | 'flood' | 'landslide' | 'occupancy' | 'sandbox';
export const FINISHES = {ivory:'#e4e0cf',sandstone:'#c6a274',terracotta:'#b46c4f',graphite:'#485960',teal:'#598c8c'} as const;
export interface Piece { id: number; kind: Kind; p: V3; rotation: number; finish?:keyof typeof FINISHES; concreteStrength?:number; reinforcement?:number }
export interface Segment { center: V3; size: V3; tilt?: number }
export interface Part { name: string; detail: string; cost: number; mass: number; force: number; torque: number; color: string; icon: string; ports: V3[]; segments: Segment[] }
const ends: V3[] = [[0,0,0],[4,0,0]];
export const deckPorts: V3[] = [[0,0,-2],[0,0,0],[0,0,2],[4,0,-2],[4,0,0],[4,0,2],[2,0,-2],[2,0,2],[2,0,0]];
export const PARTS: Record<Kind, Part> = {
  deck: { name:'Road deck', detail:'4 × 4 m · reinforced steel', cost:1200, mass:1800, force:100000, torque:85000, color:'#65757a', icon:'route', ports:deckPorts, segments:[{center:[2,-.22,0],size:[4,.44,4]}] },
  girder: { name:'Steel girder', detail:'4 m · moment connection', cost:420, mass:400, force:260000, torque:320000, color:'#e4bb64', icon:'minus', ports:ends, segments:[{center:[2,0,0],size:[4,.34,.3]}] },
  truss: { name:'Truss frame', detail:'4 × 4 m · braced module', cost:950, mass:850, force:440000, torque:680000, color:'#e9b650', icon:'triangle', ports:[[0,0,0],[4,0,0],[0,4,0],[4,4,0]], segments:[{center:[2,0,0],size:[4,.24,.24]},{center:[2,4,0],size:[4,.24,.24]},{center:[0,2,0],size:[.24,4,.24]},{center:[4,2,0],size:[.24,4,.24]},{center:[2,2,0],size:[Math.sqrt(32),.2,.2],tilt:Math.PI/4}] },
  column: { name:'Concrete column', detail:'4 m · high compression', cost:650, mass:1200, force:400000, torque:210000, color:'#b4b5ad', icon:'columns-2', ports:[[0,0,0],[0,4,0]], segments:[{center:[0,2,0],size:[.65,4,.65]}] },
  brace: { name:'Diagonal brace', detail:'4 × 4 m · lateral support', cost:360, mass:340, force:280000, torque:240000, color:'#cd9760', icon:'move-up-right', ports:[[0,0,0],[4,4,0]], segments:[{center:[2,2,0],size:[Math.sqrt(32),.26,.26],tilt:Math.PI/4}] },
  slab: { name:'Floor slab', detail:'4 × 4 m · reinforced concrete', cost:900, mass:2300, force:230000, torque:190000, color:'#b2bbb4', icon:'layers', ports:deckPorts, segments:[{center:[2,-.22,0],size:[4,.44,4]}] },
  wall: { name:'Retaining wall', detail:'4 × 4 m · reinforced panel', cost:1100, mass:3800, force:490000, torque:450000, color:'#aaafa7', icon:'brick-wall', ports:[[0,0,0],[2,0,0],[4,0,0],[0,4,0],[2,4,0],[4,4,0]], segments:[{center:[2,2,0],size:[4,4,.55]}] },
  foundation: { name:'Foundation', detail:'4 × 4 m · anchored at ground', cost:1500, mass:6500, force:850000, torque:950000, color:'#8c9993', icon:'box', ports:deckPorts, segments:[{center:[2,-.3,0],size:[4,.6,4]}] },
  facade: { name:'Glasfassade', detail:'4 × 4 m · Verglasung im Metallrahmen', cost:700, mass:650, force:95000, torque:80000, color:'#80b5c8', icon:'panels-top-left', ports:[[0,0,0],[2,0,0],[4,0,0],[0,4,0],[2,4,0],[4,4,0]], segments:[{center:[2,2,0],size:[3.84,3.84,.08]},{center:[0,2,0],size:[.14,4,.18]},{center:[4,2,0],size:[.14,4,.18]},{center:[2,0,0],size:[4,.14,.18]},{center:[2,4,0],size:[4,.14,.18]},{center:[2,2,0],size:[.09,4,.14]},{center:[2,2,0],size:[4,.09,.14]}] },
  doorway: { name:'Walkable doorway', detail:'1.2 m clear opening · 2.4 m head height', cost:820, mass:2200, force:490000, torque:450000, color:'#b68a5b', icon:'door-open', ports:[[0,0,0],[4,0,0],[0,4,0],[4,4,0]], segments:[{center:[.7,2,0],size:[1.4,4,.55]},{center:[3.3,2,0],size:[1.4,4,.55]},{center:[2,3.2,0],size:[1.2,1.6,.55]}] },
  stairwell: { name:'Stairwell opening', detail:'4 × 4 m floor module · 2.8 m clear shaft', cost:760, mass:1450, force:280000, torque:240000, color:'#9aa69e', icon:'square-dashed', ports:deckPorts, segments:[{center:[2,-.22,-1.55],size:[4,.44,.5]},{center:[2,-.22,1.55],size:[4,.44,.5]}] },
  core: { name:'Reinforced concrete core', detail:'4 × 4 m hollow elevator and stair shaft · walkable entrance', cost:4200, mass:12800, force:1800000, torque:1450000, color:'#7f8e89', icon:'building-2', ports:[[0,0,0],[4,0,0],[0,4,0],[4,4,0],[0,0,4],[4,0,4],[0,4,4],[4,4,4],[2,0,0],[2,4,0],[0,2,0],[4,2,0]], segments:[{center:[2,2,3.6],size:[4,4,.8]},{center:[0,2,3.7],size:[.8,4,.6]},{center:[4.25,2,2],size:[.5,4,4]},{center:[.7,2,0],size:[1.4,4,.8]},{center:[3.3,2,0],size:[1.4,4,.8]},{center:[2,3.2,0],size:[1.2,1.6,.8]}] },
  stair: { name:'Continuous stair', detail:'4 m floor rise · 20 risers at 0.20 m · 1.2 m clear width', cost:980, mass:1800, force:260000, torque:220000, color:'#c2a477', icon:'stairs', ports:[...deckPorts,...deckPorts.map(p=>[p[0],4,p[2]] as V3)], segments:[{center:[.4,-.1,0],size:[.8,.2,2.6] as V3},...Array.from({length:10},(_,i)=>({center:[.8+(i+.5)*.24,(i+1)*.1,-.7] as V3,size:[.24,(i+1)*.2,1.2] as V3})),{center:[3.6,1.9,0],size:[.8,.2,2.6] as V3},...Array.from({length:10},(_,i)=>({center:[3.2-(i+.5)*.24,2+(i+1)*.1,.7] as V3,size:[.24,(i+1)*.2,1.2] as V3})),{center:[.4,3.9,0],size:[.8,.2,2.6] as V3}] },
};
export const SCENARIOS: Record<Scenario,{ name:string; label:string; description:string; target:string; budget:number; duration:number }> = {
 bridge:{name:'01 / Alder crossing',label:'BRIDGE ENGINEERING',description:'Span the river. Carry a 12-tonne test truck safely to the opposite bank.',target:'Cross a 24 m span',budget:36000,duration:22},
 earthquake:{name:'02 / Fault line',label:'DISASTER LAB',description:'Build at least 8 m high. Keep your structure standing as the ground shakes.',target:'Survive 18 seconds · 8 m minimum',budget:65000,duration:18},
 wind:{name:'03 / Storm front',label:'DISASTER LAB',description:'Build at least 8 m high. Brace the upper floors against increasing lateral wind.',target:'Survive 18 seconds · 8 m minimum',budget:65000,duration:18},
  flood:{name:'04 / Rising water',label:'DISASTER LAB',description:'Build at least 8 m high. Withstand rising water, buoyancy, and a strong current.',target:'Survive 18 seconds · 8 m minimum',budget:65000,duration:18},
  landslide:{name:'05 / Unstable ground',label:'DISASTER LAB',description:'Build a retaining wall across the slope. Stop the boulders before they hit the house.',target:'Protect the house downhill',budget:55000,duration:18},
  occupancy:{name:'06 / Full house',label:'LOAD CAPACITY LAB',description:'Build at least 8 m high. Keep the building standing as increasingly heavy inhabitants and contents move in.',target:'Reach 8 m · survive 30 seconds of increasing occupancy',budget:65000,duration:30},
  sandbox:{name:'07 / Demolition yard',label:'DEMOLITION SANDBOX',description:'Experiment with physical projectile impacts using editable mass and speed.',target:'Build, launch, repeat · free play',budget:1200000,duration:120},
};
export function rotate(p: V3, r:number):V3 { const a=r*Math.PI/2; return [p[0]*Math.cos(a)+p[2]*Math.sin(a),p[1],-p[0]*Math.sin(a)+p[2]*Math.cos(a)]; }
export function ports(piece:Piece):V3[] { return PARTS[piece.kind].ports.map(v=>{const q=rotate(v,piece.rotation); return [q[0]+piece.p[0],q[1]+piece.p[1],q[2]+piece.p[2]]}); }
export function cost(pieces:Piece[]) { return pieces.reduce((n,p)=>n+PARTS[p.kind].cost,0); }
export function sample(s:Scenario):Piece[] {
 const p:Piece[]=[]; const add=(kind:Kind,x:number,y:number,z:number,rotation=0)=>p.push({id:p.length+1,kind,p:[x,y,z],rotation});
 if(s==='bridge') { for(let x=-12;x<12;x+=4) { add('deck',x,0,0); for(const z of [-2,2]) add('truss',x,0,z); } for(let x=-12;x<=12;x+=4) add('girder',x,4,2,1); }
 else if(s==='landslide') { for(let x=-8;x<8;x+=4) { add('foundation',x,0,-4); add('wall',x,0,-4); add('wall',x,4,-4); add('brace',x,0,0,1); } }
 else { for(let x=-4;x<4;x+=4) for(const z of [-2,2]) add('foundation',x,0,z); for(let y=0;y<12;y+=4) { for(const x of [-4,0,4]) for(const z of [-4,0,4]) add('column',x,y,z); for(let x=-4;x<4;x+=4) for(const z of [-2,2]) add('slab',x,y+4,z); for(const z of [-4,4]) for(const x of [-4,0]) add('brace',x,y,z); if(s==='wind')for(const z of [-4,4])for(const x of [0,4])add('brace',x,y,z,2); } }
 return p;
}
export function validateBlueprint(value:unknown): value is {scenario:Scenario;pieces:Piece[]} {
 if(!value || typeof value!=='object') return false;
 const o=value as {scenario:Scenario;pieces:Piece[]};
 if(Array.isArray(o.pieces)&&o.pieces.some(p=>p&&((p.concreteStrength!==undefined&&(!Number.isFinite(p.concreteStrength)||p.concreteStrength<.25||p.concreteStrength>2.5))||(p.reinforcement!==undefined&&(!Number.isFinite(p.reinforcement)||p.reinforcement<0||p.reinforcement>2.5)))))return false;
 return Object.hasOwn(SCENARIOS,o.scenario) && Array.isArray(o.pieces) && o.pieces.length<=(o.scenario==='sandbox'?6000:1000) && o.pieces.every(p=>p && Number.isInteger(p.id) && p.id>0 && Object.hasOwn(PARTS,p.kind) && (p.finish===undefined || typeof p.finish==='string'&&Object.hasOwn(FINISHES,p.finish)) && Number.isInteger(p.rotation) && p.rotation>=0 && p.rotation<4 && Array.isArray(p.p) && p.p.length===3 && p.p.every(n=>Number.isFinite(n)&&Math.abs(n)<=(o.scenario==='sandbox'?490:80)) && p.p[1]>=0) && new Set(o.pieces.map(p=>p.id)).size===o.pieces.length;
}
