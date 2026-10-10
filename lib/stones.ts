import { COUNTRIES, countryCode, normalizeCountryQuery } from './countries';
import { LOCALITY_ROWS } from './data/localities';
import { STONE_ROWS } from './data/stones';
import type {
  ApiErrorCode,
  CountryResponse,
  CountryStone,
  Locality,
  Paginated,
  StoneDetail,
  StoneFilters,
  StoneRef,
} from './types';

export class DataError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(message: string, code: ApiErrorCode, status: number) {
    super(message);
    this.name = 'DataError';
    this.code = code;
    this.status = status;
  }
}

/* --------------------------------- indexes -------------------------------- */

const STONES: StoneDetail[] = STONE_ROWS.map((row, index) => ({
  id: index + 1,
  name: row[0],
  formula: row[1],
  hardnessMin: row[2],
  hardnessMax: row[3],
  crystalSystem: row[4],
  colour: row[5],
  density: `${row[6]} g/cm³`,
  streak: row[7],
  lustre: row[8],
  cleavage: row[9],
  fracture: row[10],
  description: row[11],
  imaStatus: null,
}));

const STONE_BY_NAME = new Map<string, StoneDetail>(
  STONES.map((s) => [s.name.toLowerCase(), s]),
);

const STONE_ELEMENTS = new Map<number, Set<string>>(
  STONES.map((s) => [s.id, new Set(s.formula?.match(/[A-Z][a-z]?/g) ?? [])]),
);

const LOCALITIES: Locality[] = LOCALITY_ROWS.map((row, index) => {
  const refs: StoneRef[] = [];
  for (const stoneName of row[4]) {
    const stone = STONE_BY_NAME.get(stoneName.toLowerCase());
    if (stone) refs.push({ id: stone.id, name: stone.name });
  }
  return {
    id: index + 1,
    name: row[0],
    address: `${row[0]}, ${row[1]}`,
    country: row[1],
    latitude: row[2],
    longitude: row[3],
    description: null,
    stones: refs,
  };
});

const LOCALITIES_BY_STONE = new Map<number, Locality[]>();
for (const loc of LOCALITIES) {
  for (const ref of loc.stones) {
    const list = LOCALITIES_BY_STONE.get(ref.id) ?? [];
    list.push(loc);
    LOCALITIES_BY_STONE.set(ref.id, list);
  }
}

const PAGE_SIZE_STONES = 30;
const PAGE_SIZE_LOCALITIES = 200;
const PAGE_SIZE_COUNTRY = 100;

const SEARCH_ALIASES: Record<string, string[]> = {
  peridot: ['Olivine'],
  kunzite: ['Spodumene'],
  hiddenite: ['Spodumene'],
  lapis: ['Lapis Lazuli'],
  lazurite: ['Lapis Lazuli'],
  jade: ['Jadeite', 'Nephrite'],
  salt: ['Halite'],
  'rock salt': ['Halite'],
  "fool's gold": ['Pyrite'],
  'fools gold': ['Pyrite'],
  almandine: ['Garnet'],
  pyrope: ['Garnet'],
  corundum: ['Ruby', 'Sapphire'],
  selenite: ['Gypsum'],
  'iceland spar': ['Calcite'],
  schorl: ['Tourmaline'],
  elbaite: ['Tourmaline'],
  zoisite: ['Tanzanite'],
  'lead ore': ['Galena'],
  'tin ore': ['Cassiterite'],
  'iron ore': ['Hematite', 'Magnetite', 'Goethite'],
  'copper ore': ['Chalcopyrite', 'Bornite', 'Malachite'],
  mica: ['Muscovite', 'Biotite'],
  feldspar: ['Orthoclase', 'Albite', 'Labradorite'],
  garnets: ['Garnet'],
  sapphires: ['Sapphire'],
  diamonds: ['Diamond'],
  rubies: ['Ruby'],
  emeralds: ['Emerald'],
};

/* ----------------------------- stone filtering ---------------------------- */

function matchesColor(stone: StoneDetail, color: string): boolean {
  const colour = (stone.colour ?? '').toLowerCase();
  const wanted = color.toLowerCase();
  if (wanted === 'colorless' || wanted === 'colourless') return /colou?rless/.test(colour);
  return colour.includes(wanted);
}

function matchesFilters(stone: StoneDetail, filters: Partial<StoneFilters>): boolean {
  if (filters.elements && filters.elements.length > 0) {
    const present = STONE_ELEMENTS.get(stone.id);
    if (!present) return false;
    for (const el of filters.elements) {
      if (!present.has(el)) return false;
    }
  }
  const lo = typeof filters.hardnessMin === 'number' ? filters.hardnessMin : 1;
  const hi = typeof filters.hardnessMax === 'number' ? filters.hardnessMax : 10;
  if (lo > 1 || hi < 10) {
    if (stone.hardnessMin === null || stone.hardnessMax === null) return false;
    if (stone.hardnessMax < lo || stone.hardnessMin > hi) return false;
  }
  if (filters.crystalSystem) {
    if ((stone.crystalSystem ?? '').toLowerCase() !== filters.crystalSystem.toLowerCase()) return false;
  }
  if (filters.color && !matchesColor(stone, filters.color)) return false;
  return true;
}

function rank(stone: StoneDetail, query: string, aliasIds: Set<number>): number {
  if (!query) return 3;
  const name = stone.name.toLowerCase();
  if (name === query) return 0;
  if (aliasIds.has(stone.id)) return 0.5;
  if (name.startsWith(query)) return 1;
  if (name.includes(query)) return 2;
  return 4;
}

function toPage<T>(items: T[], page: number, size: number): Paginated<T> {
  const start = (page - 1) * size;
  return {
    count: items.length,
    page,
    hasMore: start + size < items.length,
    results: items.slice(start, start + size),
  };
}

/* ------------------------------- public API ------------------------------- */

export async function searchGeomaterial(
  query: string,
  filters: Partial<StoneFilters> = {},
  page = 1,
): Promise<Paginated<StoneDetail>> {
  const q = query.trim().toLowerCase();

  const aliasIds = new Set<number>();
  if (q) {
    for (const [alias, names] of Object.entries(SEARCH_ALIASES)) {
      if (alias === q || alias.startsWith(q) || q.startsWith(alias)) {
        for (const name of names) {
          const stone = STONE_BY_NAME.get(name.toLowerCase());
          if (stone) aliasIds.add(stone.id);
        }
      }
    }
  }

  const matches = STONES.filter((stone) => {
    if (!matchesFilters(stone, filters)) return false;
    if (!q) return true;
    if (aliasIds.has(stone.id)) return true;
    return (
      stone.name.toLowerCase().includes(q) ||
      (stone.formula ?? '').toLowerCase() === q ||
      (stone.formula ?? '').toLowerCase().replace(/[^a-z0-9]/g, '') === q.replace(/[^a-z0-9]/g, '')
    );
  });

  matches.sort((a, b) => rank(a, q, aliasIds) - rank(b, q, aliasIds) || a.name.localeCompare(b.name));
  return toPage(matches, page, PAGE_SIZE_STONES);
}

export async function getGeomaterialById(id: number | string): Promise<StoneDetail> {
  const stone = STONES[Number(id) - 1];
  if (!stone) throw new DataError('We could not find that stone.', 'not_found', 404);
  return stone;
}

export async function getLocalitiesByGeomaterial(
  geomaterialId: number | string,
  page = 1,
): Promise<Paginated<Locality>> {
  const list = LOCALITIES_BY_STONE.get(Number(geomaterialId)) ?? [];
  const sorted = [...list].sort(
    (a, b) => (a.country ?? '').localeCompare(b.country ?? '') || a.name.localeCompare(b.name),
  );
  return toPage(sorted, page, PAGE_SIZE_LOCALITIES);
}

export async function getLocalitiesByCountry(
  country: string,
  page = 1,
): Promise<CountryResponse> {
  const requested = normalizeCountryQuery(country);
  const code = countryCode(requested);
  const canonical =
    (code ? COUNTRIES.find((c) => c.code === code)?.name : undefined) ?? requested;

  const inCountry = LOCALITIES.filter(
    (loc) => (loc.country ?? '').toLowerCase() === canonical.toLowerCase(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const tally = new Map<number, CountryStone>();
  for (const loc of inCountry) {
    for (const stone of loc.stones) {
      const existing = tally.get(stone.id);
      if (existing) existing.localityCount += 1;
      else tally.set(stone.id, { id: stone.id, name: stone.name, localityCount: 1 });
    }
  }
  const stones = Array.from(tally.values()).sort(
    (a, b) => b.localityCount - a.localityCount || a.name.localeCompare(b.name),
  );

  return { ...toPage(inCountry, page, PAGE_SIZE_COUNTRY), country: canonical, stones };
}

export async function getLocalityById(id: number | string): Promise<Locality> {
  const locality = LOCALITIES[Number(id) - 1];
  if (!locality) throw new DataError('We could not find that locality.', 'not_found', 404);
  return locality;
}
