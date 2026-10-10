export type ApiErrorCode =
  | 'rate_limited'
  | 'upstream'
  | 'network'
  | 'not_found'
  | 'bad_request';

export interface ApiErrorBody {
  error: string;
  code: ApiErrorCode;
}

export interface StoneSummary {
  id: number;
  name: string;
  formula: string | null;
  hardnessMin: number | null;
  hardnessMax: number | null;
  crystalSystem: string | null;
  colour: string | null;
  description: string | null;
}

export interface StoneDetail extends StoneSummary {
  density: string | null;
  streak: string | null;
  lustre: string | null;
  cleavage: string | null;
  fracture: string | null;
  imaStatus: string | null;
}

export interface StoneRef {
  id: number;
  name: string;
}

export interface Locality {
  id: number;
  name: string;
  address: string;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  stones: StoneRef[];
}

export interface StoneFilters {
  elements: string[];
  hardnessMin: number;
  hardnessMax: number;
  crystalSystem: string;
  color: string;
}

export interface Paginated<T> {
  count: number;
  page: number;
  hasMore: boolean;
  results: T[];
}

export interface StoneSearchResponse extends Paginated<StoneSummary> {}

export interface StoneDetailResponse {
  stone: StoneDetail;
  localities: Paginated<Locality>;
}

export interface CountryStone {
  id: number;
  name: string;
  localityCount: number;
}

export interface CountryResponse extends Paginated<Locality> {
  country: string;
  stones: CountryStone[];
}

export interface LocalityResponse {
  locality: Locality;
}

export interface SavedStone {
  id: number;
  name: string;
  formula: string | null;
}

export const DEFAULT_FILTERS: StoneFilters = {
  elements: [],
  hardnessMin: 1,
  hardnessMax: 10,
  crystalSystem: '',
  color: '',
};

export interface MapPoint {
  id: number;
  name: string;
  country: string | null;
  lat: number;
  lng: number;
}

export function localitiesToPoints(localities: Locality[]): MapPoint[] {
  const points: MapPoint[] = [];
  for (const loc of localities) {
    if (
      typeof loc.latitude === 'number' &&
      typeof loc.longitude === 'number' &&
      Math.abs(loc.latitude) <= 90 &&
      Math.abs(loc.longitude) <= 180 &&
      !(loc.latitude === 0 && loc.longitude === 0)
    ) {
      points.push({
        id: loc.id,
        name: loc.name,
        country: loc.country,
        lat: loc.latitude,
        lng: loc.longitude,
      });
    }
  }
  return points;
}
