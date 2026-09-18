import { ARCHITECTURAL_SHOWCASES } from './architectural-showcases';
import { PARTS, type Kind, type Piece, type V3 } from './catalog';
import { withBuildingAccessibility } from './building-accessibility';
import {applyBuildingMaterials} from './concrete-materials';

export interface Showcase {
  id: string;
  name: string;
  detail: string;
  count: number;
  cost: number;
  height: number;
}

const make = () => {
  const pieces: Piece[] = [];
  const add = (kind: Kind, p: V3, rotation = 0, finish?:Piece['finish']) => pieces.push({ id: pieces.length + 1, kind, p, rotation, ...(finish?{finish}:{}) });
  const addColumns = (y: number, xs: number[], zs: number[]) => xs.forEach(x => zs.forEach(z => add('column', [x, y, z])));
  const addSlabs = (y: number, xs: number[], zs: number[]) => xs.forEach(x => zs.forEach(z => add('slab', [x, y, z])));
  const addBraces = (y: number, xs: number[], zs: number[]) => xs.forEach(x => zs.forEach(z => add('brace', [x, y, z])));
  const finish = (id: string, name: string, detail: string, height: number) => ({ id, name, detail, height, pieces });
  return { add, addColumns, addSlabs, addBraces, finish };
};

type Layout = ReturnType<typeof make> extends infer T ? T extends { finish: (...args: any[]) => infer R } ? R : never : never;

function steppedHighrise(): Layout {
  const { add, addColumns, addSlabs, finish } = make();
  // Four foundations cover the 3 × 3 lower column grid through their shared ports.
  [-4, 0].forEach(x => [-2, 2].forEach(z => add('foundation', [x, 0, z])));
  const lower = [-4, 0, 4];
  for (let y = 0; y < 16; y += 4) { addColumns(y, lower, [-4, 0, 4]); addSlabs(y + 4, [-4, 0], [-2, 2]); }
  // Upper storeys step back to one 4 × 4 bay while retaining a clean load path.
  for (let y = 16; y < 28; y += 4) { addColumns(y, [-4, 0], [-2, 2]); addSlabs(y + 4, [-4], [0]); }
  return finish('stepped-highrise', 'Staffel-Hochhaus', 'Gestufter Wohnturm mit breitem Sockel und Rücksprung', 28);
}

function bracedTower(): Layout {
  const { add, addColumns, addSlabs, addBraces, finish } = make();
  [-4, 0].forEach(x => add('foundation', [x, 0, 0]));
  const xs = [-4, 0, 4], zs = [-2, 2];
  for (let y = 0; y < 28; y += 4) {
    addColumns(y, xs, zs);
    addBraces(y, [-4, 0], zs);
    addSlabs(y + 4, [-4, 0], [0]);
  }
  return finish('braced-tower', 'Windturm', 'Schlanker 28 m Turm mit umlaufenden Diagonalverbänden', 28);
}

function grandHall(): Layout {
  const { add, addColumns, addSlabs, finish } = make();
  // Five bays wide × two bays deep, with an open, column-free interior at roof level.
  [-12, -8, -4, 0].forEach(x => [-2, 2].forEach(z => add('foundation', [x, 0, z])));
  const xs = [-12, -8, -4, 0, 4];
  for (let y = 0; y < 12; y += 4) addColumns(y, xs, [-4, 0, 4]);
  addSlabs(12, [-12, -8, -4, 0], [-2, 2]);
  // Perimeter roof beams make the hall read as one broad, finished volume.
  [-4, 4].forEach(z => [-12, -8, -4, 0].forEach(x => add('girder', [x, 12, z])));
  [-12, -8, -4, 0, 4].forEach(x => add('girder', [x, 12, 4], 1));
  return finish('grand-hall', 'Große Halle', 'Breite zweistöckige Halle mit umlaufendem Dachkranz', 12);
}

function twinTowers(): Layout {
  const { add, addColumns, addSlabs, addBraces, finish } = make();
  // Two separated 4 m towers, each with a pair of bays in the x direction.
  [-12, 4].forEach(x => add('foundation', [x, 0, 0]));
  for (let y = 0; y < 28; y += 4) {
    addColumns(y, [-12, -8, 4, 8], [-2, 2]);
    addBraces(y, [-12, 4], [-2, 2]);
    addSlabs(y + 4, [-12, 4], [0]);
  }
  // Three 4 m deck modules bridge the 12 m gap at the 16 m level.
  [-8, -4, 0].forEach(x => add('deck', [x, 16, 0]));
  [-8, -4, 0].forEach(x => [-2, 2].forEach(z => add('girder', [x, 16, z])));
  return finish('twin-towers', 'Zwillingstürme', 'Zwei 28 m Türme mit Skybridge auf halber Höhe', 28);
}

function cascadeForum(): Layout {
  const { add, finish } = make();
  const lowerX=[-8,-4,0,4,8],lowerZ=[-4,0,4];
  for(const x of [-8,-4,0,4])for(const z of [-2,2])add('foundation',[x,0,z],0,'sandstone');
  for(const y of [0,4,8,12]){
   for(const x of lowerX)for(const z of lowerZ)add('column',[x,y,z],0,'ivory');
   for(const x of [-8,-4,0,4])for(const z of [-2,2])add('slab',[x,y+4,z],0,'sandstone');
   for(const x of [-8,-4,0,4])for(const z of [-4,4])add('brace',[x,y,z],0,'graphite');
   if(y%8===0)for(const x of [-8,-4,0,4])for(const z of [-4,4])add('facade',[x,y,z],0,z<0?'teal':'terracotta');
  }
  for(const y of [16,20,24,28,32]){
   for(const x of [-4,0,4])for(const z of [-2,2])add('column',[x,y,z],0,'ivory');
   for(const x of [-4,0])add('slab',[x,y+4,0],0,'ivory');
   for(const x of [-4,0])for(const z of [-2,2])add('brace',[x,y,z],0,'graphite');
   if((y-16)%8===0)for(const x of [-4,0])for(const z of [-2,2])add('facade',[x,y,z],0,z<0?'teal':'sandstone');
  }
  return finish('cascade-forum','Kaskadenforum','36 m Terrassenhochhaus auf breitem Sockel mit farbigen Glasbändern und gestuftem Turm',36);
}

function orbitExchange(): Layout {
  const { add, finish } = make();
  for(const x of [-12,4])add('foundation',[x,0,0],0,'graphite');
  for(const y of [0,4,8,12,16,20,24,28,32,36]){
   for(const x of [-12,-8,4,8])for(const z of [-2,2])add('column',[x,y,z],0,'sandstone');
   for(const x of [-12,4])add('slab',[x,y+4,0],0,'graphite');
   for(const x of [-12,4])for(const z of [-2,2])add('brace',[x,y,z],0,'graphite');
   if(y%8===0){for(const x of [-12,4])for(const z of [-2,2])add('facade',[x,y,z],0,'teal');for(const x of [-12,8])add('facade',[x,y,2],1,x<0?'terracotta':'sandstone');}
  }
  for(const y of [16,28]){
   for(const x of [-8,-4,0])add('deck',[x,y,0],0,'graphite');
   for(const x of [-8,-4,0])for(const z of [-2,2])add('girder',[x,y,z],0,'sandstone');
  }
  return finish('orbit-exchange','Orbit Exchange','Zwei 40 m Bürotürme mit zwei übereinanderliegenden Skybridges',40);
}

function rheinwerkTerminal(): Layout {
  const { add, finish } = make(),xs=[-16,-12,-8,-4,0,4,8],edgeX=[-16,8];
  for(const x of [-16,-12,-8,-4,0,4])for(const z of [-2,2])add('foundation',[x,0,z],0,'graphite');
  for(const y of [0,4,8,12,16]){
   for(const x of xs)for(const z of [-4,0,4])add('column',[x,y,z],0,'graphite');
   if(y<16)for(const x of [-16,-12,-8,-4,0,4])for(const z of [-2,2])add('slab',[x,y+4,z],0,'sandstone');
   if(y%8===0){for(const x of [-16,-12,-8,-4,0,4])for(const z of [-4,4])add('facade',[x,y,z],0,z<0?'teal':'terracotta');for(const x of edgeX)for(const z of [0,4])add('facade',[x,y,z],1,'sandstone');}
  }
  for(const y of [20,24,28]){
   for(const x of xs)for(const z of [-4,4])add('column',[x,y,z],0,'graphite');
   for(const x of edgeX)add('column',[x,y,0],0,'graphite');
  }
  for(const y of [20,24])for(const x of [-16,-12,-8,-4,0,4])for(const z of [-4,4])add('truss',[x,y,z],0,'graphite');
  for(const x of [-16,-12,-8,-4,0,4])for(const z of [-2,2])add('slab',[x,32,z],0,'ivory');
  return finish('rheinwerk-terminal','Rheinwerk Terminal','32 m hoher und 24 m langer Industriekomplex mit offenem Oberbau und Fachwerkkrone',32);
}

const layouts: Layout[] = [...ARCHITECTURAL_SHOWCASES, steppedHighrise(), bracedTower(), grandHall(), twinTowers(), cascadeForum(), orbitExchange(), rheinwerkTerminal()]
  .map((layout,index) => ({ ...layout, pieces: applyBuildingMaterials(withBuildingAccessibility(layout.pieces, { maxStairs: Infinity }),layout.id.includes('twin')||layout.id==='orbit-exchange'?'skybridge':layout.id.includes('rheinwerk')||layout.id==='hafenwerft'?'refinery':layout.id==='aurora-tower'||layout.id==='stepped-highrise'?'art-deco':'classic',index+101) }));

export const SHOWCASES: Showcase[] = layouts.map(({ pieces, ...meta }) => ({
  ...meta,
  count: pieces.length,
  cost: pieces.reduce((sum, piece) => sum + PARTS[piece.kind].cost, 0),
}));

export function showcasePieces(id: string): Piece[] {
  const layout = layouts.find(item => item.id === id);
  return layout ? layout.pieces.map(piece => ({ ...piece, p: [...piece.p] as V3 })) : [];
}
