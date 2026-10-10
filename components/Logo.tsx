'use client';

import { useId } from 'react';

const HEX = 'M32 4 L55 17.5 V46.5 L32 60 L9 46.5 V17.5 Z';
const SHADE = 'M32 4 L55 17.5 V46.5 L32 60 Z';
const CROWN = 'M32 4 L55 17.5 L32 31 L9 17.5 Z';
const CENTER_LINE = 'M32 31 V60';
const PAVILION_LINES = 'M9 46.5 L32 31 L55 46.5';

let markupCounter = 0;

/** Raw SVG string of the crystal — used for Leaflet map pins. */
export function crystalSvgString(size = 36): string {
  markupCounter += 1;
  const id = `pk-m${markupCounter}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" style="overflow:visible" aria-hidden="true">` +
    `<defs><linearGradient id="${id}" x1="12" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#fbbf24"/></linearGradient>` +
    `<filter id="${id}-g" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.5"/></filter></defs>` +
    `<path d="${HEX}" fill="#f59e0b" opacity="0.5" filter="url(#${id}-g)"/>` +
    `<path d="${HEX}" fill="url(#${id})"/>` +
    `<path d="${SHADE}" fill="#000" opacity="0.14"/>` +
    `<path d="${CROWN}" fill="#fff" opacity="0.28"/>` +
    `<path d="${PAVILION_LINES}" fill="none" stroke="#fff" stroke-opacity="0.2" stroke-width="1.2" stroke-linejoin="round"/>` +
    `<path d="${CENTER_LINE}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="${HEX}" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="1" stroke-linejoin="round"/>` +
    `</svg>`
  );
}

interface CrystalIconProps {
  size?: number;
  glow?: boolean;
  className?: string;
}

export function CrystalIcon({ size = 40, glow = true, className }: CrystalIconProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `pk-grad-${uid}`;
  const glowId = `pk-glow-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradId} x1="12" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      {glow && <path d={HEX} fill="#f59e0b" opacity="0.5" filter={`url(#${glowId})`} />}
      <path d={HEX} fill={`url(#${gradId})`} />
      <path d={SHADE} fill="#000" opacity="0.14" />
      <path d={CROWN} fill="#fff" opacity="0.28" />
      <path
        d={PAVILION_LINES}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.2"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d={CENTER_LINE}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d={HEX}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.3"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-semibold tracking-tighter leading-none select-none ${className}`}
    >
      <span className="text-white">Pathor</span>
      <span className="text-[#f59e0b]">-Ko</span>
    </span>
  );
}

interface LogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: number;
  glow?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

export default function Logo({
  variant = 'full',
  size = 36,
  glow = true,
  className = '',
  wordmarkClassName = 'text-xl',
}: LogoProps) {
  if (variant === 'icon') {
    return <CrystalIcon size={size} glow={glow} className={className} />;
  }
  if (variant === 'wordmark') {
    return <Wordmark className={`${wordmarkClassName} ${className}`} />;
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CrystalIcon size={size} glow={glow} />
      <Wordmark className={wordmarkClassName} />
    </span>
  );
}

/** Branded spinner: the crystal slowly rotating 360°. */
export function CrystalSpinner({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex animate-spin-slow will-change-transform ${className}`}
      style={{ width: size, height: size }}
    >
      <CrystalIcon size={size} />
    </span>
  );
}
