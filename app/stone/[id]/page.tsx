'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark, ExternalLink, Loader2 } from 'lucide-react';
import Formula from '@/components/Formula';
import LocalityList from '@/components/LocalityList';
import MapView from '@/components/MapView';
import Tap from '@/components/Tap';
import { SkeletonDetail } from '@/components/LoadingSkeleton';
import { ErrorNotice } from '@/components/States';
import { useToast } from '@/components/Toast';
import { swatchFor } from '@/lib/color';
import { fetchJson, useApi } from '@/lib/useApi';
import { useSaved } from '@/lib/useSaved';
import { localitiesToPoints, type Locality, type StoneDetailResponse } from '@/lib/types';

function hardness(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null && min !== max) return `${min} – ${max}`;
  return String(min ?? max);
}

export default function StoneDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, error, loading, retry } = useApi<StoneDetailResponse>(`/api/stone/${id}`);
  const { isSaved, toggle } = useSaved();
  const { show } = useToast();

  const [showAll, setShowAll] = useState(false);
  const [extra, setExtra] = useState<{ items: Locality[]; page: number; hasMore: boolean } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const localities = useMemo(
    () => [...(data?.localities.results ?? []), ...(extra?.items ?? [])],
    [data, extra],
  );
  const points = useMemo(() => localitiesToPoints(localities), [localities]);
  const hasMore = extra ? extra.hasMore : data?.localities.hasMore ?? false;

  const loadMore = async () => {
    if (loadingMore) return;
    const page = extra ? extra.page + 1 : 2;
    setLoadingMore(true);
    try {
      const res = await fetchJson<StoneDetailResponse>(`/api/stone/${id}?page=${page}`);
      setExtra((prev) => ({
        items: [...(prev?.items ?? []), ...res.localities.results],
        page,
        hasMore: res.localities.hasMore,
      }));
    } catch (e) {
      show({
        message: (e as Error).message,
        actionLabel: 'Retry',
        onAction: () => void loadMore(),
      });
    } finally {
      setLoadingMore(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <ErrorNotice error={error} onRetry={retry} />
      </div>
    );
  }

  if (loading || !data) return <SkeletonDetail />;

  const { stone } = data;
  const swatch = swatchFor(stone.colour);
  const saved = isSaved(stone.id);

  const props: Array<{ label: string; value: string | null }> = [
    { label: 'Hardness (Mohs)', value: hardness(stone.hardnessMin, stone.hardnessMax) },
    { label: 'Density', value: stone.density },
    { label: 'Streak', value: stone.streak },
    { label: 'Luster', value: stone.lustre },
    { label: 'Crystal system', value: stone.crystalSystem },
    { label: 'Cleavage', value: stone.cleavage },
    { label: 'Fracture', value: stone.fracture },
    { label: 'Color', value: stone.colour },
  ];

  const shownLocalities = showAll ? localities : localities.slice(0, 10);

  return (
    <div className="pb-nav mx-auto max-w-5xl space-y-6 px-4 pt-5 md:px-6">
      <Tap className="inline-block">
        <Link href="/search" className="btn-ghost -ml-1 text-sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to search
        </Link>
      </Tap>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="glass relative overflow-hidden rounded-4xl p-6 md:p-10"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: swatch }}
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-9 w-9 shrink-0 rounded-2xl border border-white/20 shadow-soft"
                style={{ background: `linear-gradient(135deg, ${swatch}, rgba(255,255,255,0.25))` }}
                title={stone.colour ?? 'Color swatch'}
                aria-label={stone.colour ? `Color: ${stone.colour}` : 'Color swatch'}
              />
              {stone.imaStatus && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                  {stone.imaStatus}
                </span>
              )}
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tighter md:text-6xl">
              {stone.name}
            </h1>
            {stone.formula && (
              <p className="mt-3 text-xl text-amber-gold md:text-2xl">
                <Formula value={stone.formula} />
              </p>
            )}
            {stone.description && (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
                {stone.description}
              </p>
            )}
          </div>
          <Tap>
            <button
              type="button"
              onClick={() => toggle({ id: stone.id, name: stone.name, formula: stone.formula })}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from saved' : 'Save stone'}
              className="btn-ghost h-12 w-12 shrink-0 !px-0"
            >
              <Bookmark className={`h-5 w-5 ${saved ? 'fill-amber-gold text-amber-gold' : ''}`} aria-hidden="true" />
            </button>
          </Tap>
        </div>
      </motion.section>

      <section aria-label="Physical properties">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {props.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: Math.min(i, 20) * 0.05 }}
              className="glass rounded-2xl p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {p.label}
              </p>
              <p className="mt-1.5 text-[15px] font-medium leading-snug text-zinc-100">
                {p.value ?? <span className="text-zinc-600">Not listed</span>}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section aria-label="Found in" className="space-y-4">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="text-2xl font-semibold tracking-tighter">Found in</h2>
          <span className="text-sm text-zinc-500">
            {data.localities.count.toLocaleString()} localities
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-72 md:h-[26rem]">
            <MapView points={points} scrollWheelZoom={false} />
          </div>
          <div className="space-y-3">
            <LocalityList localities={shownLocalities} />
            <div className="flex flex-wrap gap-2">
              {localities.length > 10 && (
                <Tap>
                  <button type="button" className="btn-ghost" onClick={() => setShowAll((v) => !v)}>
                    {showAll ? 'Show top 10' : `Show all ${localities.length.toLocaleString()} loaded`}
                  </button>
                </Tap>
              )}
              {showAll && hasMore && (
                <Tap>
                  <button type="button" className="btn-ghost" onClick={() => void loadMore()} disabled={loadingMore}>
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    Load more
                  </button>
                </Tap>
              )}
            </div>
          </div>
        </div>
      </section>

      <p className="glass rounded-2xl px-5 py-4 text-sm text-zinc-400">
        No photos here, just the facts. Want to see what it looks like?{' '}
        <a
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(stone.name.replace(/ /g, '_'))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-amber-gold underline-offset-4 hover:underline"
        >
          Read more on Wikipedia <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
