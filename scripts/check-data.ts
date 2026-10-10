import { COUNTRIES } from '../lib/countries';
import { LOCALITY_ROWS } from '../lib/data/localities';
import { STONE_ROWS } from '../lib/data/stones';

const stones = new Set(STONE_ROWS.map((r) => r[0].toLowerCase()));
const countries = new Set(COUNTRIES.map((c) => c.name));
const problems: string[] = [];
const used = new Set<string>();

if (stones.size !== STONE_ROWS.length) problems.push('Duplicate stone names');
for (const r of STONE_ROWS) {
  if (r[2] > r[3]) problems.push(`Hardness range reversed: ${r[0]}`);
}
for (const [name, country, lat, lng, list] of LOCALITY_ROWS) {
  if (!countries.has(country)) problems.push(`Unknown country "${country}" at ${name}`);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) problems.push(`Bad coordinates: ${name}`);
  if (list.length === 0) problems.push(`No stones: ${name}`);
  for (const s of list) {
    used.add(s.toLowerCase());
    if (!stones.has(s.toLowerCase())) problems.push(`Unknown stone "${s}" at ${name}`);
  }
}
const unused = STONE_ROWS.map((r) => r[0]).filter((n) => !used.has(n.toLowerCase()));
if (unused.length) problems.push(`Stones with no locality: ${unused.join(', ')}`);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(
  `OK: ${STONE_ROWS.length} stones, ${LOCALITY_ROWS.length} localities, ${new Set(LOCALITY_ROWS.map((r) => r[1])).size} countries.`,
);
