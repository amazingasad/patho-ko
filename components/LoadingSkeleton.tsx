'use client';

import { CrystalSpinner } from './Logo';

export function BrandLoader({ label = 'Digging through the rocks…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <CrystalSpinner size={56} />
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass flex items-center gap-4 rounded-2xl p-4">
      <div className="shimmer h-12 w-12 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2.5">
        <div className="shimmer h-4 w-2/5" />
        <div className="shimmer h-3 w-3/5" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6" aria-busy="true">
      <div className="glass rounded-4xl p-6 md:p-10">
        <div className="shimmer mb-4 h-5 w-24" />
        <div className="shimmer mb-3 h-10 w-2/3" />
        <div className="shimmer h-5 w-1/3" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4">
            <div className="shimmer mb-3 h-3 w-1/2" />
            <div className="shimmer h-5 w-3/4" />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <CrystalSpinner size={44} />
      </div>
    </div>
  );
}

export function SkeletonMap() {
  return (
    <div className="shimmer flex h-full min-h-[240px] w-full items-center justify-center rounded-2xl">
      <CrystalSpinner size={40} />
    </div>
  );
}
