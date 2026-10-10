'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';
import { flagEmoji } from '@/lib/countries';
import type { Locality } from '@/lib/types';

interface LocalityListProps {
  localities: Locality[];
  limit?: number;
  emptyText?: string;
}

export default function LocalityList({
  localities,
  limit,
  emptyText = 'No localities with coordinates yet.',
}: LocalityListProps) {
  const items = typeof limit === 'number' ? localities.slice(0, limit) : localities;

  if (items.length === 0) {
    return <p className="glass rounded-2xl px-4 py-6 text-center text-sm text-zinc-400">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2.5">
      {items.map((loc, i) => (
        <motion.li
          key={loc.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: Math.min(i, 20) * 0.05 }}
          whileTap={{ scale: 0.96 }}
          className="will-change-transform"
        >
          <Link
            href={`/locality/${loc.id}`}
            className="glass flex min-h-[60px] items-center gap-3.5 rounded-2xl p-3.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-gold/60"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber/10 text-amber-gold">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold tracking-tight text-zinc-50">
                {loc.name}
              </span>
              <span className="block truncate text-xs text-zinc-500">
                {flagEmoji(loc.country)} {loc.country ?? 'Unknown country'}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600" aria-hidden="true" />
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
