'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bookmark, ChevronRight } from 'lucide-react';
import Formula from './Formula';
import { swatchFor } from '@/lib/color';
import { useSaved } from '@/lib/useSaved';

export interface StoneCardData {
  id: number;
  name: string;
  formula?: string | null;
  hardnessMin?: number | null;
  hardnessMax?: number | null;
  crystalSystem?: string | null;
  colour?: string | null;
  note?: string | null;
}

interface StoneCardProps {
  stone: StoneCardData;
  index?: number;
  selected?: boolean;
  onSelect?: (stone: StoneCardData) => void;
}

function hardnessLabel(min?: number | null, max?: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null && min !== max) return `Mohs ${min}–${max}`;
  return `Mohs ${min ?? max}`;
}

export default function StoneCard({ stone, index = 0, selected = false, onSelect }: StoneCardProps) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(stone.id);
  const meta = [hardnessLabel(stone.hardnessMin, stone.hardnessMax), stone.crystalSystem]
    .filter(Boolean)
    .join(' · ');

  const body = (
    <>
      <span
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10"
        style={{
          background: `linear-gradient(135deg, ${swatchFor(stone.colour)}, rgba(255,255,255,0.08))`,
        }}
        aria-hidden="true"
      >
        <span className="text-lg font-bold text-black/60">{stone.name.charAt(0).toUpperCase()}</span>
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-base font-semibold tracking-tight text-zinc-50">
          {stone.name}
        </span>
        {stone.formula && (
          <span className="block truncate text-sm text-amber-gold/90">
            <Formula value={stone.formula} />
          </span>
        )}
        {(meta || stone.note) && (
          <span className="mt-0.5 block truncate text-xs text-zinc-500">{stone.note ?? meta}</span>
        )}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600" aria-hidden="true" />
    </>
  );

  const frame = `flex min-h-[64px] flex-1 items-center gap-3.5 rounded-2xl p-3.5 pr-12 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-gold/60`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut', delay: Math.min(index, 20) * 0.05 }}
      whileTap={{ scale: 0.96 }}
      className={`glass relative flex rounded-2xl will-change-transform ${
        selected ? 'border-amber/60 bg-amber/10 shadow-glow' : 'hover:bg-white/10'
      }`}
    >
      {onSelect ? (
        <button type="button" className={`${frame} select-none`} onClick={() => onSelect(stone)}>
          {body}
        </button>
      ) : (
        <Link href={`/stone/${stone.id}`} className={`${frame} select-none`}>
          {body}
        </Link>
      )}
      <button
        type="button"
        aria-label={saved ? `Remove ${stone.name} from saved` : `Save ${stone.name}`}
        aria-pressed={saved}
        onClick={() => toggle({ id: stone.id, name: stone.name, formula: stone.formula ?? null })}
        className="tap absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:text-amber-gold"
      >
        <Bookmark
          className={`h-5 w-5 ${saved ? 'fill-amber-gold text-amber-gold' : ''}`}
          aria-hidden="true"
        />
      </button>
    </motion.div>
  );
}
