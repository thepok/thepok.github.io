import { SCENARIOS, type Kind, type Scenario } from './catalog';

export interface Challenge {
  id: string;
  name: string;
  scenario: Scenario;
  description: string;
  target: string;
  budget: number;
  intensity: number;
  rules: {
    vehicleMass?: number;
    duration?: number;
    minHeight?: number;
    minFloorArea?: number;
    rockCount?: number;
    rockInterval?: number;
    aftershock?: boolean;
    sandbox?: boolean;
  };
  allowedParts?: Kind[];
}

const bridge = SCENARIOS.bridge;
const earthquake = SCENARIOS.earthquake;
const wind = SCENARIOS.wind;
const flood = SCENARIOS.flood;
const landslide = SCENARIOS.landslide;
const occupancy = SCENARIOS.occupancy;

export const CHALLENGES: Challenge[] = [
  {
    id: 'bridge-alder-crossing', name: bridge.name, scenario: 'bridge',
    description: bridge.description, target: bridge.target, budget: bridge.budget, intensity: 1,
    rules: { vehicleMass: 12000, duration: bridge.duration },
  },
  {
    id: 'bridge-heavy-freight', name: '01B / Heavy freight', scenario: 'bridge',
    description: 'Span the river and carry a 20-tonne freight hauler safely across.',
    target: 'Cross a 24 m span · 20 t load', budget: 45000, intensity: 1,
    rules: { vehicleMass: 20000, duration: 26 },
  },
  {
    id: 'bridge-steel-only', name: '01C / Steel economy', scenario: 'bridge',
    description: 'Build a lean crossing using steel road decks, girders, trusses, and braces.',
    target: 'Cross a 24 m span · steel parts only', budget: 27000, intensity: 1,
    rules: { vehicleMass: 12000, duration: 22 }, allowedParts: ['deck', 'girder', 'truss', 'brace'],
  },
  {
    id: 'earthquake-fault-line', name: earthquake.name, scenario: 'earthquake',
    description: earthquake.description, target: earthquake.target, budget: earthquake.budget, intensity: 1,
    rules: { duration: earthquake.duration, minHeight: 8 },
  },
  {
    id: 'earthquake-aftershock', name: '02B / Aftershock tower', scenario: 'earthquake',
    description: 'Reach for a taller skyline, then keep the tower standing through the aftershock.',
    target: 'Survive 24 seconds · 16 m minimum · aftershock', budget: 82000, intensity: 1.15,
    rules: { duration: 24, minHeight: 16, aftershock: true },
  },
  {
    id: 'earthquake-minimal-frame', name: '02C / Minimum frame', scenario: 'earthquake',
    description: 'Build two usable floors with columns, braces and foundations, within a tight budget.',
    target: 'Survive 18 seconds · 8 m minimum · 32 m² per floor', budget: 44000, intensity: 1,
    rules: { duration: 18, minHeight: 8 }, allowedParts: ['column', 'brace', 'foundation', 'slab'],
  },
  {
    id: 'wind-storm-front', name: wind.name, scenario: 'wind',
    description: wind.description, target: wind.target, budget: wind.budget, intensity: 1,
    rules: { duration: wind.duration, minHeight: 8 },
  },
  {
    id: 'wind-violent-gust', name: '03B / Violent gust', scenario: 'wind',
    description: 'Build at least 8 m high and hold the upper floors through violent crosswinds.',
    target: 'Survive 22 seconds · 8 m minimum · 1.5× wind', budget: 76000, intensity: 1.5,
    rules: { duration: 22, minHeight: 8 },
  },
  {
    id: 'flood-rising-water', name: flood.name, scenario: 'flood',
    description: flood.description, target: flood.target, budget: flood.budget, intensity: 1,
    rules: { duration: flood.duration, minHeight: 8 },
  },
  {
    id: 'flood-fast-current', name: '04B / Flash current', scenario: 'flood',
    description: 'Raise a tall structure before a fast, powerful current reaches the upper deck.',
    target: 'Survive 24 seconds · 8 m minimum · 1.35× water force', budget: 78000, intensity: 1.35,
    rules: { duration: 24, minHeight: 8 },
  },
  {
    id: 'landslide-unstable-ground', name: landslide.name, scenario: 'landslide',
    description: landslide.description, target: landslide.target, budget: landslide.budget, intensity: 1,
    rules: { duration: landslide.duration, rockCount: 20, rockInterval: .5 },
  },
  {
    id: 'landslide-rockfall-barrage', name: '05B / Rockfall barrage', scenario: 'landslide',
    description: 'Reinforce the slope before a dense barrage of boulders reaches the house.',
    target: 'Protect the house · 32 rocks · 0.3 s interval', budget: 72000, intensity: 1.2,
    rules: { duration: 22, rockCount: 32, rockInterval: .3 },
  },
  {
    id: 'occupancy-full-house', name: occupancy.name, scenario: 'occupancy',
    description: occupancy.description, target: occupancy.target, budget: occupancy.budget, intensity: 1,
    rules: { duration: occupancy.duration, minHeight: 8 },
  },
  {
    id: 'occupancy-warehouse-loads', name: '06B / Warehouse loads', scenario: 'occupancy',
    description: 'Raise an 8 m building and keep it stable as heavy contents are added floor by floor.',
    target: 'Reach 8 m · survive 30 seconds · 1.5× occupancy load', budget: 82000, intensity: 1.5,
    rules: { duration: 30, minHeight: 8 },
  },
  {
    id: 'sandbox-demolition-yard', name: '07 / Demolition yard', scenario: 'sandbox',
    description: 'Experiment with physical projectile impacts using editable mass and speed.',
    target: 'Build, launch, repeat · free play', budget: 1200000, intensity: 1,
    rules: { sandbox: true },
  },
];

export const DEFAULT_CHALLENGE: Record<Scenario, string> = {
  bridge: 'bridge-alder-crossing',
  earthquake: 'earthquake-fault-line',
  wind: 'wind-storm-front',
  flood: 'flood-rising-water',
  landslide: 'landslide-unstable-ground',
  occupancy: 'occupancy-full-house',
  sandbox: 'sandbox-demolition-yard',
};

export function getChallenge(id: string): Challenge {
  return CHALLENGES.find(challenge => challenge.id === id) ?? CHALLENGES.find(challenge => challenge.id === DEFAULT_CHALLENGE.bridge)!;
}
