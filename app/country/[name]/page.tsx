'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import LocalityList from '@/components/LocalityList';
import MapView from '@/components/MapView';
import StoneCard from '@/components/StoneCard';
import Tap from '@/components/Tap';
import { BrandLoader, SkeletonList } from '@/components/LoadingSkeleton';
import { EmptyState, ErrorNotice } from '@/components/States';
import { useToast } from '@/components/Toast';
import { flagEmoji } from '@/lib/countries';
import { fetchJson, useApi } from '@/lib/useApi';
import { localitiesToPoints, type CountryResponse, type Locality } from '@/lib/types';

type Tab = 'stones' | 'localities' | 'map';

const STONE_PAGE = 48;

export default function CountryPage() {
  const params = useParams<{ name: string }>();
  const name = useMemo(() => {
    try {
      return decodeURIComponent(params.name);
    } catch {
      return params.name;
    }
  }, [params.name]);

  const base = `/api/country?name=${encodeURIComponent(name)}`;
  const { data, error, loading, retry } = useApi<CountryResponse>(base);
  const { show } = useToast();

  const [tab, setTab] = useState<Tab>('stones');
  const [filter, setFilter] = useState('');
  const [limit, setLimit] = useState(STONE_PAGE);
  const [extra, setExtra] = useState<{ items: Locality[]; page: number; hasMore: boolean } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const localities = useMemo(
    () => [...(data?.results ?? []), ...(extra?.items ?? [])],
    [data, extra],
  );
  const hasMore = extra ? extra.hasMore : data?.hasMore ?? false;

  const stones = useMemo(() => {
    const tally = new Map<number, { id: number; name: string; count: number }>();
    for (const loc of localities) {
      for (const s of loc.stones) {
        const existing = tally.get(s.id);
        if (existing) existing.count += 1;
        else tally.set(s.id, { id: s.id, name: s.name, count: 1 });
      }
    }
    return Array.from(tally.values()).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name),
    );
  }, [localities]);

  const filteredStones = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? stones.filter((s) => s.name.toLowerCase().includes(q)) : stones;
  }, [stones, filter]);

  const points = useMemo(() => localitiesToPoints(localities), [localities]);
  const displayName = data?.country ?? name;

  const loadMore = async () => {
    if (loadingMore) return;
    const page = extra ? extra.page + 1 : 2;
    setLoadingMore(true);
    try {
      const res = await fetchJson<CountryResponse>(`${base}&page=${page}`);
      setExtra((prev) => ({
        items: [...(prev?.items ?? []), ...res.results],
        page,
        hasMore: res.hasMore,
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

  const tabs: Array<{ id: Tab; label: string; mobileOnly?: boolean }> = [
    { id: 'stones', label: `Stones${stones.length ? ` (${stones.length})` : ''}` },
    { id: 'localities', label: 'Localities' },
    { id: 'map', label: 'Map', mobileOnly: true },
  ];

  return (
    <div className="pb-nav mx-auto max-w-[1600px] space-y-6 px-4 pt-5 md:px-6">
      <Tap className="inline-block">
        <Link href="/" className="btn-ghost -ml-1 text-sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
      </Tap>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="glass relative overflow-hidden rounded-4xl p-6 md:p-10"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-3 text-5xl" aria-hidden="true">
            {flagEmoji(displayName)}
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tighter md:text-6xl">{displayName}</h1>
          <p className="mt-3 text-zinc-400">
            {data
              ? `${localities.length.toLocaleString()} of ${data.count.toLocaleString()} localities loaded · ${stones.length.toLocaleString()} stone types found so far`
              : 'Looking up what lives underground…'}
          </p>
        </div>
      </motion.section>

      {loading && !data && (
        <>
          <BrandLoader label="Collecting stones from every corner…" />
          <SkeletonList count={5} />
        </>
      )}

      {error && <ErrorNotice error={error} onRetry={retry} />}

      {data && localities.length === 0 && (
        <EmptyState
          title={`Nothing found for “${displayName}”`}
          hint="Check the spelling or try the full country name, like Brazil or United States."
          showSuggestions={false}
        />
      )}

      {data && localities.length > 0 && (
        <>
          <div
            role="tablist"
            aria-label="Country results"
            className="glass grid max-w-md grid-cols-3 rounded-2xl p-1 md:grid-cols-2"
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTab(t.id)}
                  className={`tap relative select-none rounded-xl px-2 text-sm font-semibold transition-colors ${
                    t.mobileOnly ? 'md:hidden' : ''
                  } ${active ? 'text-[#1a1203]' : 'text-zinc-400 hover:text-white'}`}
                >
                  {active && (
                    <motion.span
                      layoutId="country-tab-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber to-amber-gold"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="md:flex md:items-start md:gap-6">
            <div
              className={`min-w-0 space-y-4 md:block md:w-[28rem] md:shrink-0 xl:w-[34rem] ${
                tab === 'map' ? 'hidden' : 'block'
              }`}
            >
              {(tab === 'stones' || tab === 'map') && (
                <section aria-label="Stone types" className={tab === 'map' ? 'hidden md:block' : ''}>
                  <div className="relative mb-3">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={filter}
                      onChange={(e) => {
                        setFilter(e.target.value);
                        setLimit(STONE_PAGE);
                      }}
                      placeholder="Filter stones in this list…"
                      aria-label="Filter stones"
                      className="field pl-11 [&::-webkit-search-cancel-button]:hidden"
                    />
                  </div>
                  <div className="space-y-2.5">
                    {filteredStones.slice(0, limit).map((s, i) => (
                      <StoneCard
                        key={s.id}
                        index={i}
                        stone={{
                          id: s.id,
                          name: s.name,
                          note: `Found at ${s.count} loaded ${s.count === 1 ? 'locality' : 'localities'}`,
                        }}
                      />
                    ))}
                    {filteredStones.length === 0 && (
                      <p className="glass rounded-2xl px-4 py-6 text-center text-sm text-zinc-400">
                        No stones match that filter.
                      </p>
                    )}
                  </div>
                  {filteredStones.length > limit && (
                    <Tap className="mt-3">
                      <button type="button" className="btn-ghost w-full" onClick={() => setLimit((l) => l + STONE_PAGE)}>
                        Show more stones
                      </button>
                    </Tap>
                  )}
                </section>
              )}

              {tab === 'localities' && (
                <section aria-label="Localities">
                  <LocalityList localities={localities} />
                </section>
              )}

              {hasMore && (
                <Tap>
                  <button
                    type="button"
                    className="btn-primary w-full"
                    onClick={() => void loadMore()}
                    disabled={loadingMore}
                  >
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    Load more localities to find more stones
                  </button>
                </Tap>
              )}
            </div>

            <div
              className={`h-[65dvh] min-h-[320px] md:sticky md:top-24 md:block md:h-[calc(100dvh-7rem)] md:min-w-0 md:flex-1 ${
                tab === 'map' ? 'block' : 'hidden'
              }`}
            >
              <MapView points={points} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
