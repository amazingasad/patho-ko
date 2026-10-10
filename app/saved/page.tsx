'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import StoneCard from '@/components/StoneCard';
import Tap from '@/components/Tap';
import { SkeletonList } from '@/components/LoadingSkeleton';
import { SUGGESTED_STONES } from '@/lib/color';
import { useSaved } from '@/lib/useSaved';

export default function SavedPage() {
  const { saved } = useSaved();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pb-nav mx-auto max-w-2xl space-y-6 px-4 pt-8 md:px-6 md:pt-12">
      <div>
        <h1 className="text-4xl font-semibold tracking-tighter">Saved</h1>
        <p className="mt-2 text-zinc-400">Stones you bookmarked live here, on this device.</p>
      </div>

      {!mounted ? (
        <SkeletonList count={3} />
      ) : saved.length === 0 ? (
        <div className="glass flex flex-col items-center rounded-3xl px-6 py-12 text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber/10 text-amber-gold">
            <Bookmark className="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-semibold tracking-tight">Nothing saved yet</h2>
          <p className="mt-1.5 max-w-xs text-sm text-zinc-400">
            Tap the bookmark on any stone to keep it handy.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SUGGESTED_STONES.map((stone) => (
              <Tap key={stone}>
                <Link href={`/search?q=${encodeURIComponent(stone)}`} className="chip">
                  {stone}
                </Link>
              </Tap>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {saved.map((stone, i) => (
            <StoneCard key={stone.id} index={i} stone={{ id: stone.id, name: stone.name, formula: stone.formula }} />
          ))}
        </div>
      )}
    </div>
  );
}
