const SWATCHES: Array<[RegExp, string]> = [
  [/colou?rless|transparent|clear/i, '#e5e7eb'],
  [/red|crimson|ruby|scarlet/i, '#ef4444'],
  [/pink|rose/i, '#f472b6'],
  [/orange/i, '#fb923c'],
  [/yellow|gold|amber/i, '#fbbf24'],
  [/green|emerald/i, '#22c55e'],
  [/blue|azure|sapphire/i, '#3b82f6'],
  [/violet|purple|lilac|amethyst/i, '#a855f7'],
  [/brown|tan|bronze/i, '#a16207'],
  [/black|dark/i, '#27272a'],
  [/grey|gray|silver|steel/i, '#9ca3af'],
  [/white|milky/i, '#f4f4f5'],
];

export function swatchFor(colour: string | null | undefined): string {
  if (!colour) return '#f59e0b';
  for (const [pattern, hex] of SWATCHES) {
    if (pattern.test(colour)) return hex;
  }
  return '#f59e0b';
}

export const COLOR_CHIPS: Array<{ name: string; hex: string }> = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#fbbf24' },
  { name: 'Black', hex: '#27272a' },
  { name: 'White', hex: '#f4f4f5' },
  { name: 'Brown', hex: '#a16207' },
  { name: 'Colorless', hex: '#cbd5e1' },
];

export const CRYSTAL_SYSTEMS = [
  'Cubic',
  'Hexagonal',
  'Tetragonal',
  'Orthorhombic',
  'Monoclinic',
  'Triclinic',
  'Trigonal',
  'Amorphous',
];

export const ELEMENT_CHIPS = [
  'Fe',
  'Cu',
  'Au',
  'Ag',
  'Si',
  'Ca',
  'Al',
  'Mg',
  'Pb',
  'Zn',
  'Na',
  'K',
  'Ti',
  'Mn',
  'S',
  'C',
];

export const SUGGESTED_STONES = ['Quartz', 'Ruby', 'Gold', 'Diamond'];
