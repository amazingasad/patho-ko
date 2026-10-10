const RAW =
  'AF:Afghanistan|AL:Albania|DZ:Algeria|AD:Andorra|AO:Angola|AG:Antigua and Barbuda|AR:Argentina|AM:Armenia|AU:Australia|AT:Austria|AZ:Azerbaijan|' +
  'BS:Bahamas|BH:Bahrain|BD:Bangladesh|BB:Barbados|BY:Belarus|BE:Belgium|BZ:Belize|BJ:Benin|BT:Bhutan|BO:Bolivia|BA:Bosnia and Herzegovina|BW:Botswana|BR:Brazil|BN:Brunei|BG:Bulgaria|BF:Burkina Faso|BI:Burundi|' +
  'KH:Cambodia|CM:Cameroon|CA:Canada|CV:Cape Verde|CF:Central African Republic|TD:Chad|CL:Chile|CN:China|CO:Colombia|KM:Comoros|CG:Congo|CD:Democratic Republic of the Congo|CR:Costa Rica|CI:Ivory Coast|HR:Croatia|CU:Cuba|CY:Cyprus|CZ:Czech Republic|' +
  'DK:Denmark|DJ:Djibouti|DM:Dominica|DO:Dominican Republic|EC:Ecuador|EG:Egypt|SV:El Salvador|GQ:Equatorial Guinea|ER:Eritrea|EE:Estonia|SZ:Eswatini|ET:Ethiopia|' +
  'FJ:Fiji|FI:Finland|FR:France|GA:Gabon|GM:Gambia|GE:Georgia|DE:Germany|GH:Ghana|GR:Greece|GD:Grenada|GT:Guatemala|GN:Guinea|GW:Guinea-Bissau|GY:Guyana|' +
  'HT:Haiti|HN:Honduras|HU:Hungary|IS:Iceland|IN:India|ID:Indonesia|IR:Iran|IQ:Iraq|IE:Ireland|IL:Israel|IT:Italy|JM:Jamaica|JP:Japan|JO:Jordan|' +
  'KZ:Kazakhstan|KE:Kenya|KI:Kiribati|KW:Kuwait|KG:Kyrgyzstan|LA:Laos|LV:Latvia|LB:Lebanon|LS:Lesotho|LR:Liberia|LY:Libya|LI:Liechtenstein|LT:Lithuania|LU:Luxembourg|' +
  'MG:Madagascar|MW:Malawi|MY:Malaysia|MV:Maldives|ML:Mali|MT:Malta|MR:Mauritania|MU:Mauritius|MX:Mexico|MD:Moldova|MC:Monaco|MN:Mongolia|ME:Montenegro|MA:Morocco|MZ:Mozambique|MM:Myanmar|' +
  'NA:Namibia|NP:Nepal|NL:Netherlands|NZ:New Zealand|NI:Nicaragua|NE:Niger|NG:Nigeria|KP:North Korea|MK:North Macedonia|NO:Norway|OM:Oman|' +
  'PK:Pakistan|PA:Panama|PG:Papua New Guinea|PY:Paraguay|PE:Peru|PH:Philippines|PL:Poland|PT:Portugal|QA:Qatar|RO:Romania|RU:Russia|RW:Rwanda|' +
  'SA:Saudi Arabia|SN:Senegal|RS:Serbia|SC:Seychelles|SL:Sierra Leone|SG:Singapore|SK:Slovakia|SI:Slovenia|SB:Solomon Islands|SO:Somalia|ZA:South Africa|KR:South Korea|SS:South Sudan|ES:Spain|LK:Sri Lanka|SD:Sudan|SR:Suriname|SE:Sweden|CH:Switzerland|SY:Syria|' +
  'TW:Taiwan|TJ:Tajikistan|TZ:Tanzania|TH:Thailand|TL:Timor-Leste|TG:Togo|TO:Tonga|TT:Trinidad and Tobago|TN:Tunisia|TR:Turkey|TM:Turkmenistan|' +
  'UG:Uganda|UA:Ukraine|AE:United Arab Emirates|GB:United Kingdom|US:United States|UY:Uruguay|UZ:Uzbekistan|VU:Vanuatu|VA:Vatican City|VE:Venezuela|VN:Vietnam|YE:Yemen|ZM:Zambia|ZW:Zimbabwe|' +
  'GL:Greenland|PR:Puerto Rico|NC:New Caledonia|XK:Kosovo|PS:Palestine|HK:Hong Kong|MO:Macao';

interface CountryEntry {
  code: string;
  name: string;
}

export const COUNTRIES: CountryEntry[] = RAW.split('|').map((pair) => {
  const idx = pair.indexOf(':');
  return { code: pair.slice(0, idx), name: pair.slice(idx + 1) };
});

const ALIASES: Record<string, string> = {
  usa: 'US',
  'u.s.a.': 'US',
  'u.s.': 'US',
  us: 'US',
  'united states of america': 'US',
  uk: 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  'northern ireland': 'GB',
  'great britain': 'GB',
  'czechia': 'CZ',
  'burma': 'MM',
  'swaziland': 'SZ',
  'democratic republic of congo': 'CD',
  'dr congo': 'CD',
  'republic of the congo': 'CG',
  'cote d\'ivoire': 'CI',
  'russian federation': 'RU',
  'korea': 'KR',
  'republic of korea': 'KR',
  'viet nam': 'VN',
  'macedonia': 'MK',
  'east timor': 'TL',
  'cabo verde': 'CV',
  'turkiye': 'TR',
};

const BY_NAME = new Map<string, string>(
  COUNTRIES.map((c) => [c.name.toLowerCase(), c.code]),
);

export function countryCode(name: string | null | undefined): string | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return BY_NAME.get(key) ?? ALIASES[key] ?? null;
}

export function flagEmoji(name: string | null | undefined): string {
  const code = countryCode(name);
  if (!code) return '🌍';
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

/** Maps "USA" and its variants to the canonical "United States". */
export function normalizeCountryQuery(name: string): string {
  const trimmed = name.trim();
  const key = trimmed.toLowerCase();
  if (
    key === 'usa' ||
    key === 'u.s.a.' ||
    key === 'u.s.' ||
    key === 'us' ||
    key === 'united states of america'
  ) {
    return 'United States';
  }
  return trimmed;
}

export function suggestCountries(query: string, limit = 6): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: string[] = [];
  const contains: string[] = [];
  for (const c of COUNTRIES) {
    const n = c.name.toLowerCase();
    if (n.startsWith(q)) starts.push(c.name);
    else if (n.includes(q)) contains.push(c.name);
  }
  for (const [alias, code] of Object.entries(ALIASES)) {
    if (alias.startsWith(q)) {
      const entry = COUNTRIES.find((c) => c.code === code);
      if (entry && !starts.includes(entry.name)) starts.push(entry.name);
    }
  }
  return [...starts, ...contains].slice(0, limit);
}
