// Generates the PWA PNG icons from the Pathor-Ko crystal.
// Usage: npm run icons   (requires the "sharp" dev dependency, already in package.json)
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, '..', 'public');

const crystal = (transform) => `
  <g transform="${transform}">
    <path d="M32 4 L55 17.5 V46.5 L32 60 L9 46.5 V17.5 Z" fill="#f59e0b" opacity="0.5" filter="url(#glow)"/>
    <path d="M32 4 L55 17.5 V46.5 L32 60 L9 46.5 V17.5 Z" fill="url(#g)"/>
    <path d="M32 4 L55 17.5 V46.5 L32 60 Z" fill="#000" opacity="0.14"/>
    <path d="M32 4 L55 17.5 L32 31 L9 17.5 Z" fill="#fff" opacity="0.28"/>
    <path d="M9 46.5 L32 31 L55 46.5" fill="none" stroke="#fff" stroke-opacity="0.2" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M32 31 V60" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M32 4 L55 17.5 V46.5 L32 60 L9 46.5 V17.5 Z" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1" stroke-linejoin="round"/>
  </g>`;

const defs = `
  <defs>
    <linearGradient id="g" x1="12" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#fbbf24"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3.5"/>
    </filter>
  </defs>`;

// Rounded-square icon: crystal scaled to ~60% of the canvas, centred.
const roundedSvg = (size) => {
  const scale = (size * 0.6) / 64;
  const offset = (size - 64 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${defs}
    <rect width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}" fill="#0a0a0f"/>
    ${crystal(`translate(${offset} ${offset}) scale(${scale})`)}
  </svg>`;
};

// Maskable icon: full-bleed background, crystal inside the 80% safe zone.
const maskableSvg = (size) => {
  const scale = (size * 0.5) / 64;
  const offset = (size - 64 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${defs}
    <rect width="${size}" height="${size}" fill="#0a0a0f"/>
    ${crystal(`translate(${offset} ${offset}) scale(${scale})`)}
  </svg>`;
};

async function render(svg, file) {
  const out = path.join(publicDir, file);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log('wrote', path.relative(process.cwd(), out));
}

await mkdir(publicDir, { recursive: true });
await render(roundedSvg(512), 'icon-512.png');
await render(roundedSvg(192), 'icon-192.png');
await render(maskableSvg(512), 'icon-maskable-512.png');
await writeFile(path.join(publicDir, '.gitkeep'), '');
