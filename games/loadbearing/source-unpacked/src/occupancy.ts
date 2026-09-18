import type { Simulation, DynamicItem } from './physics';
import type { Piece, V3 } from './catalog';

type Slab = { piece: Piece; item: DynamicItem };

/** Physical cargo proxy for occupants and contents in the occupancy scenario. */
export class OccupancyLoad {
  tonnes = 0;
  wave = 0;
  count = 0;

  private readonly slabs: Slab[];
  private readonly slots: V3[] = [
    [-1, 0, -1], [0, 0, -1], [1, 0, -1],
    [-1, 0, 1], [0, 0, 1], [1, 0, 1],
  ];

  constructor(private readonly sim: Simulation) {
    this.slabs = sim.pieces
      .filter(piece => piece.kind === 'slab')
      .map(piece => ({ piece, item: sim.items.find(item => item.id === piece.id && item.kind === 'slab') }))
      .filter((slab): slab is Slab => !!slab.item)
      .sort((a, b) => b.piece.p[1] - a.piece.p[1])
      .slice(0, 12);
  }

  update(time: number): void {
    // One wave begins at t=2 and arrives every four seconds, through t=22.
    while (this.wave < 6 && time >= 2 + this.wave * 4) {
      this.spawnWave(this.wave);
      this.wave++;
    }
  }

  private spawnWave(wave: number): void {
    const mass = 200 * (wave + 1) * Math.max(0, this.sim.intensity);
    for (const slab of this.slabs) {
      // A fallen floor should not receive more cargo. Existing cargo remains dynamic.
      const body = slab.item.body;
      const bodyPosition = body.GetPosition();
      const floorY = bodyPosition.GetY();
      if (slab.item.fractured || floorY < slab.item.initial[1] - 1.5) continue;

      const slot = this.slots[wave % this.slots.length];
      const local: V3 = [slot[0], 0, slot[2]];
      const offset = this.currentYawOffset(body, local);
      const p: V3 = [
        bodyPosition.GetX() + offset[0],
        bodyPosition.GetY() + offset[1],
        bodyPosition.GetZ() + offset[2],
      ];
      const id = this.sim.allocateItemId();
      this.sim.dynamicBox([id, 'payload'], p, [0.9, 0.9, 0.9], mass);
      this.count++;
      this.tonnes += mass / 1000;
    }
  }

  private currentYawOffset(body: any, local: V3): V3 {
    // Rotate the complete local cargo center, including its height above the slab.
    const localPoint: V3 = [2 + local[0], 0.45, local[2]];
    const q = body.GetRotation();
    const qx = q.GetX(), qy = q.GetY(), qz = q.GetZ(), qw = q.GetW();
    const [x, y, z] = localPoint;
    const tx = 2 * (qy * z - qz * y);
    const ty = 2 * (qz * x - qx * z);
    const tz = 2 * (qx * y - qy * x);
    return [x + qw * tx + qy * tz - qz * ty, y + qw * ty + qz * tx - qx * tz, z + qw * tz + qx * ty - qy * tx];
  }
}
