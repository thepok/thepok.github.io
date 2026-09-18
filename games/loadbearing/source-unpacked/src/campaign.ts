import { sample, type Piece } from './catalog';
import type { Challenge } from './challenges';

/** The ordered, three-tier progression used by the campaign screen. */
export interface CampaignLevel extends Challenge {
  order: number;
  tier: number;
  brief: string;
}

const level = (
  order: number,
  tier: number,
  id: string,
  name: string,
  scenario: CampaignLevel['scenario'],
  description: string,
  target: string,
  budget: number,
  intensity: number,
  rules: Challenge['rules'],
  brief: string,
): CampaignLevel => ({
  id, order, tier, name, scenario, description, budget, intensity, brief,
  target: rules.minHeight ? `${target} · je ${tier===1?32:tier===2?48:64} m² Geschossfläche` : target,
  rules: rules.minHeight ? {...rules,minFloorArea:tier===1?32:tier===2?48:64} : rules,
});

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  level(1, 1, 'campaign-01', '01 / Kleine Brücke', 'bridge', 'Baue eine sichere Querung für einen leichten Testwagen.', '6 t über 24 m bringen', 28000, 1, { vehicleMass: 6000, duration: 22 }, 'Setze ein Brückendeck in die Lücke bei X 0 / Z 0 auf Bauhöhe 0 m.'),
  level(2, 1, 'campaign-02', '02 / Erstes Beben', 'earthquake', 'Errichte einen niedrigen Turm und halte ihn im Erdbeben.', '18 s überstehen · 8 m Höhe', 60000, .7, { duration: 18, minHeight: 8 }, 'Vier Fundamente bilden deinen Startpunkt.'),
  level(3, 1, 'campaign-03', '03 / Erster Sturm', 'wind', 'Versteife einen niedrigen Turm gegen seitlichen Wind.', '18 s überstehen · 8 m Höhe', 60000, .6, { duration: 18, minHeight: 8 }, 'Stabilisiere zuerst das erste Geschoss.'),
  level(4, 1, 'campaign-04', '04 / Erstes Hochwasser', 'flood', 'Halte ein niedriges Gebäude über dem steigenden Wasser.', '18 s überstehen · 8 m Höhe', 60000, .5, { duration: 18, minHeight: 8 }, 'Baue vom Fundament aus nach oben.'),
  level(5, 1, 'campaign-05', '05 / Kleiner Hang', 'landslide', 'Sichere den Hang gegen herabrollende Felsbrocken.', 'Haus schützen · 14 Felsen', 38000, 1, { duration: 18, rockCount: 14, rockInterval: .5 }, 'Beginne nur mit den vier Fundamenten.'),
  level(6, 1, 'campaign-06', '06 / Kleines Haus', 'occupancy', 'Baue ein kleines Haus für die erste Belegungswelle.', '8 m erreichen · 30 s · 6 Wellen', 60000, .5, { duration: 30, minHeight: 8 }, 'Plane Reserven für sechs Lastwellen ein.'),

  level(7, 2, 'campaign-07', '07 / Lastbrücke', 'bridge', 'Trage einen schweren Frachtwagen über die vollständige Spannweite.', '12 t über 24 m bringen', 26000, 1.0, { vehicleMass: 12000, duration: 22 }, 'Verstärke die Mitte mit einem sparsamen Tragwerk.'),
  level(8, 2, 'campaign-08', '08 / Mittleres Beben', 'earthquake', 'Baue einen höheren Turm, der dem stärkeren Beben standhält.', '21 s überstehen · 12 m Höhe', 68000, 1.15, { duration: 21, minHeight: 12 }, 'Höhe verlangt ein durchgehend ausgesteiftes Gerüst.'),
  level(9, 2, 'campaign-09', '09 / Starke Böen', 'wind', 'Halte die oberen Geschosse in kräftigen Querwinden.', '21 s überstehen · 12 m Höhe', 68000, 1.1, { duration: 21, minHeight: 12 }, 'Führe die Aussteifung bis zum Dach.'),
  level(10, 2, 'campaign-10', '10 / Schnelle Flut', 'flood', 'Schütze einen höheren Bau gegen Strömung und Auftrieb.', '21 s überstehen · 12 m Höhe', 70000, 1.0, { duration: 21, minHeight: 12 }, 'Ein steifer Unterbau hält dem Wasser länger stand.'),
  level(11, 2, 'campaign-11', '11 / Felsregen', 'landslide', 'Verstärke den Hang, bevor ein dichter Felsregen einsetzt.', 'Haus schützen · 20 Felsen', 42000, 1.15, { duration: 21, rockCount: 20, rockInterval: .5 }, 'Schließe Lücken in der Schutzwand.'),
  level(12, 2, 'campaign-12', '12 / Volles Haus', 'occupancy', 'Halte ein mittleres Gebäude mit wachsender Innenlast stabil.', '12 m erreichen · 30 s · 6 Wellen', 72000, 1.0, { duration: 30, minHeight: 12 }, 'Zusätzliche Geschosse brauchen Lastpfade bis zum Boden.'),

  level(13, 3, 'campaign-13', '13 / Schwerlastbrücke', 'bridge', 'Trage einen 22-Tonnen-Frachtwagen sicher ans andere Ufer.', '22 t über 24 m bringen', 24000, 1, { vehicleMass: 22000, duration: 22 }, 'Jedes Bauteil muss seinen Preis rechtfertigen.'),
  level(14, 3, 'campaign-14', '14 / Großes Beben', 'earthquake', 'Halte einen hohen Turm im langen, starken Erdbeben.', '24 s überstehen · 12 m Höhe', 82000, 1.3, { duration: 24, minHeight: 12 }, 'Steife den hohen Turm in beiden horizontalen Richtungen aus.'),
  level(15, 3, 'campaign-15', '15 / Orkanhöhe', 'wind', 'Sichere die volle Turmhöhe gegen extreme Seitenkräfte.', '24 s überstehen · 16 m Höhe', 82000, 1.3, { duration: 24, minHeight: 16 }, 'Verteile die Kräfte über mehrere Ebenen.'),
  level(16, 3, 'campaign-16', '16 / Flutwelle', 'flood', 'Überstehe die lange Flutwelle mit einem hohen, standfesten Bau.', '24 s überstehen · 16 m Höhe', 84000, 1.7, { duration: 24, minHeight: 16 }, 'Verankere den unteren Bereich gegen Auftrieb.'),
  level(17, 3, 'campaign-17', '17 / Hangsturz', 'landslide', 'Stoppe eine maximale Felslawine vor dem Haus.', 'Haus schützen · 32 Felsen', 46000, 1.55, { duration: 24, rockCount: 32, rockInterval: .35 }, 'Staffele abgestützte Wände am Hang vor dem Haus.'),
  level(18, 3, 'campaign-18', '18 / Schwer bewohnt', 'occupancy', 'Halte das höchste Gebäude trotz maximaler Innenlast stabil.', '16 m erreichen · 30 s · 6 Wellen', 82000, 1.5, { duration: 30, minHeight: 16 }, 'Rechne mit der schwersten Belegung bis zum Schluss.'),
];

const byId = new Map(CAMPAIGN_LEVELS.map(item => [item.id, item]));

export function getCampaignLevel(id: string): CampaignLevel | undefined {
  return byId.get(id);
}

function clonePieces(pieces: Piece[]): Piece[] {
  return pieces.map((piece, index) => ({ ...piece, id: index + 1, p: [...piece.p] as Piece['p'] }));
}

/** Return an intentionally incomplete scaffold that teaches the next construction step. */
export function starterPieces(levelOrId: CampaignLevel | string): Piece[] {
  const current = typeof levelOrId === 'string' ? getCampaignLevel(levelOrId) : levelOrId;
  if (!current) return [];
  const pieces = sample(current.scenario);
  if (current.scenario === 'bridge') {
    if (current.tier === 1) return clonePieces(pieces.filter(piece => !(piece.kind === 'deck' && piece.p[0] === 0)));
    if (current.tier === 2) return clonePieces(pieces.filter(piece => Math.abs(piece.p[0]) >= 8));
    return clonePieces(pieces.filter(piece => Math.abs(piece.p[0]) >= 8));
  }
  if (current.scenario === 'landslide') return clonePieces(pieces.filter(piece => piece.kind === 'foundation'));
  return clonePieces(pieces.filter(piece =>
    piece.kind === 'foundation' ||
    (piece.kind === 'column' && piece.p[1] === 0) ||
    (piece.kind === 'slab' && piece.p[1] === 4)
  ));
}

export type CampaignProgress = Record<string, { cost: number; completedAt: number }>;

export function normalizeProgress(value: unknown): CampaignProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: CampaignProgress = {};
  for (const [id, entry] of Object.entries(value)) {
    if (!byId.has(id) || !entry || typeof entry !== 'object') continue;
    const candidate = entry as { cost?: unknown; completedAt?: unknown };
    if (typeof candidate.cost !== 'number' || !Number.isFinite(candidate.cost) || candidate.cost < 0) continue;
    if (typeof candidate.completedAt !== 'number' || !Number.isFinite(candidate.completedAt)) continue;
    result[id] = { cost: candidate.cost, completedAt: candidate.completedAt };
  }
  return result;
}

export function isUnlocked(levelId: string, progress: unknown): boolean {
  const current = getCampaignLevel(levelId);
  if (!current) return false;
  if (current.order === 1) return true;
  const previous = CAMPAIGN_LEVELS[current.order - 2];
  return Boolean(normalizeProgress(progress)[previous.id]);
}

export function recordCompletion(progress: unknown, id: string, cost: number, now = Date.now()): CampaignProgress {
  const result = normalizeProgress(progress);
  if (!byId.has(id) || !Number.isFinite(cost) || cost < 0 || !Number.isFinite(now)) return result;
  const existing = result[id];
  result[id] = existing && existing.cost <= cost
    ? existing
    : { cost, completedAt: now };
  return result;
}
