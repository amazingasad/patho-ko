'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, Globe2, List, Loader2, Map as MapIcon, Smartphone } from 'lucide-react';
import SearchBar, { type SearchMode } from './SearchBar';
import FilterPanel, { countActiveFilters } from './FilterPanel';
import StoneCard from './StoneCard';
import LocalityList from './LocalityList';
import MapView from './MapView';
import Formula from './Formula';
import Tap from './Tap';
import { CrystalIcon } from './Logo';
import { BrandLoader, SkeletonList } from './LoadingSkeleton';
import { EmptyState, ErrorNotice } from './States';
import { useToast } from './Toast';
import { fetchJson, useApi } from '@/lib/useApi';
import { SUGGESTED_STONES } from '@/lib/color';
import {
  DEFAULT_FILTERS,
  localitiesToPoints,
  type Locality,
  type StoneDetailResponse,
  type StoneFilters,
  type StoneSearchResponse,
  type StoneSummary,
} from '@/lib/types';

type ParamReader = { get(name: string): string | null };

function parseFilters(sp: ParamReader): StoneFilters {
  const num = (key: string, fallback: number) => {
    const v = parseFloat(sp.get(key) ?? '');
    return Number.isFinite(v) ? v : fallback;
  };
  return {
    elements: (sp.get('el_inc') ?? '').split(',').filter(Boolean),
    hardnessMin: num('hardness_min', DEFAULT_FILTERS.hardnessMin),
    hardnessMax: num('hardness_max', DEFAULT_FILTERS.hardnessMax),
    crystalSystem: sp.get('csystem') ?? '',
    color: sp.get('color') ?? '',
  };
}

function toParams(q: string, f: StoneFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (q.trim()) p.set('q', q.trim());
  if (f.elements.length > 0) p.set('el_inc', f.elements.join(','));
  if (f.hardnessMin > DEFAULT_FILTERS.hardnessMin) p.set('hardness_min', String(f.hardnessMin));
  if (f.hardnessMax < DEFAULT_FILTERS.hardnessMax) p.set('hardness_max', String(f.hardnessMax));
  if (f.crystalSystem) p.set('csystem', f.crystalSystem);
  if (f.color) p.set('color', f.color);
  return p;
}

const COUNTRY_SUGGESTIONS = ['Brazil', 'Namibia', 'USA', 'Madagascar'];

interface MoreStones {
  key: string;
  items: StoneSummary[];
  page: number;
  hasMore: boolean;
}

interface MoreLocalities {
  key: number;
  items: Locality[];
  page: number;
  hasMore: boolean;
}

export default function Explorer({ variant }: { variant: 'home' | 'search' }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { show } = useToast();

  const urlQ = sp.get('q') ?? '';
  const urlFilters = useMemo(() => parseFilters(sp), [sp]);
  const appliedParams = useMemo(() => toParams(urlQ, urlFilters).toString(), [urlQ, urlFilters]);
  const hasSearch = appliedParams !== '';
  const searchUrl = hasSearch ? `/api/stone?${appliedParams}` : null;

  const [mode, setMode] = useState<SearchMode>('stone');
  const [value, setValue] = useState(urlQ);
  const [draft, setDraft] = useState<StoneFilters>(urlFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [moreStones, setMoreStones] = useState<MoreStones | null>(null);
  const [moreLocalities, setMoreLocalities] = useState<MoreLocalities | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const hasSearchRef = useRef(hasSearch);

  useEffect(() => {
    setValue(urlQ);
  }, [urlQ]);

  useEffect(() => {
    setDraft(urlFilters);
  }, [urlFilters]);

  useEffect(() => {
    if (hasSearchRef.current && window.matchMedia('(min-width: 1280px)').matches) {
      setFiltersOpen(true);
    }
  }, []);

  /* ------------------------------ data ------------------------------ */
  const search = useApi<StoneSearchResponse>(searchUrl);

  useEffect(() => {
    const first = search.data?.results[0];
    setSelectedId(first ? first.id : null);
    setShowAll(false);
    setMobileView('list');
  }, [search.data]);

  const stones = useMemo(() => {
    const base = search.data?.results ?? [];
    return moreStones && moreStones.key === searchUrl ? [...base, ...moreStones.items] : base;
  }, [search.data, moreStones, searchUrl]);

  const hasMoreStones =
    moreStones && moreStones.key === searchUrl ? moreStones.hasMore : search.data?.hasMore ?? false;

  const detail = useApi<StoneDetailResponse>(selectedId ? `/api/stone/${selectedId}` : null);
  const detailForSelected = detail.data && detail.data.stone.id === selectedId ? detail.data : null;

  const localities = useMemo(() => {
    const base = detailForSelected?.localities.results ?? [];
    return moreLocalities && moreLocalities.key === selectedId
      ? [...base, ...moreLocalities.items]
      : base;
  }, [detailForSelected, moreLocalities, selectedId]);

  const hasMoreLocalities =
    moreLocalities && moreLocalities.key === selectedId
      ? moreLocalities.hasMore
      : detailForSelected?.localities.hasMore ?? false;

  const points = useMemo(() => localitiesToPoints(localities), [localities]);
  const selectedStone =
    detailForSelected?.stone ?? stones.find((s) => s.id === selectedId) ?? null;

  /* ---------------------------- actions ----------------------------- */
  const run = useCallback(
    (q: string, f: StoneFilters) => {
      const params = toParams(q, f).toString();
      if (!params) return;
      router.push(`${pathname}?${params}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleSubmit = (raw: string) => {
    if (mode === 'country') {
      const name = raw.trim();
      if (name) router.push(`/country/${encodeURIComponent(name)}`);
      return;
    }
    run(raw, draft);
  };

  const applyFilters = () => {
    run(value, draft);
    if (window.matchMedia('(max-width: 767px)').matches) setFiltersOpen(false);
  };

  const clearFilters = () => {
    setDraft(DEFAULT_FILTERS);
    run(value, DEFAULT_FILTERS);
    if (!value.trim()) router.push(pathname, { scroll: false });
  };

  const loadMoreStones = async () => {
    if (!searchUrl || loadingMore) return;
    const page = moreStones && moreStones.key === searchUrl ? moreStones.page + 1 : 2;
    setLoadingMore(true);
    try {
      const res = await fetchJson<StoneSearchResponse>(`${searchUrl}&page=${page}`);
      setMoreStones((prev) => ({
        key: searchUrl,
        items: [...(prev && prev.key === searchUrl ? prev.items : []), ...res.results],
        page,
        hasMore: res.hasMore,
      }));
    } catch (error) {
      show({
        message: (error as Error).message,
        actionLabel: 'Retry',
        onAction: () => void loadMoreStones(),
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreLocalities = async () => {
    if (!selectedId || loadingMore) return;
    const page = moreLocalities && moreLocalities.key === selectedId ? moreLocalities.page + 1 : 2;
    setLoadingMore(true);
    try {
      const res = await fetchJson<StoneDetailResponse>(`/api/stone/${selectedId}?page=${page}`);
      setMoreLocalities((prev) => ({
        key: selectedId,
        items: [...(prev && prev.key === selectedId ? prev.items : []), ...res.localities.results],
        page,
        hasMore: res.localities.hasMore,
      }));
    } catch (error) {
      show({
        message: (error as Error).message,
        actionLabel: 'Retry',
        onAction: () => void loadMoreLocalities(),
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const searchBar = (
    <SearchBar
      mode={mode}
      onModeChange={setMode}
      value={value}
      onValueChange={setValue}
      onSubmit={handleSubmit}
      onToggleFilters={() => setFiltersOpen((open) => !open)}
      activeFilterCount={countActiveFilters(draft)}
      autoFocus={variant === 'search' && !hasSearch}
      busy={search.loading}
    />
  );

  const filterPanel = (
    <FilterPanel
      open={filtersOpen && mode === 'stone'}
      onClose={() => setFiltersOpen(false)}
      value={draft}
      onChange={setDraft}
      onApply={applyFilters}
      onClear={clearFilters}
    />
  );

  /* ------------------------------ hero ------------------------------ */
  if (!hasSearch) {
    return (
      <div className="pb-nav mx-auto max-w-[1600px] px-4 pt-8 md:px-6 md:pt-14">
        <div className="md:flex md:gap-6">
          {filterPanel}
          <div className="mx-auto min-w-0 max-w-3xl flex-1 text-center">
            {variant === 'home' ? (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="animate-float will-change-transform">
                    <CrystalIcon size={96} />
                  </div>
                </div>
                <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
                  Discover where{' '}
                  <span className="bg-gradient-to-r from-amber to-amber-gold bg-clip-text text-transparent">
                    every stone
                  </span>{' '}
                  lives.
                </h1>
                <p className="mx-auto mb-8 mt-4 max-w-xl text-balance text-base text-zinc-400 md:text-lg">
                  Pick any stone and see every place on Earth it has been found, or choose a country
                  and explore what lies beneath it.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">Search</h1>
                <p className="mb-6 mt-2 text-zinc-400">Find a stone, or explore a country.</p>
              </>
            )}

            {searchBar}

            <div className="mt-8 space-y-4">
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Popular stones
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_STONES.map((stone) => (
                    <Tap key={stone}>
                      <Link href={`${pathname}?q=${encodeURIComponent(stone)}`} className="chip">
                        <Gem className="h-3.5 w-3.5 text-amber-gold" aria-hidden="true" />
                        {stone}
                      </Link>
                    </Tap>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Popular countries
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {COUNTRY_SUGGESTIONS.map((country) => (
                    <Tap key={country}>
                      <Link href={`/country/${encodeURIComponent(country)}`} className="chip">
                        <Globe2 className="h-3.5 w-3.5 text-amber-gold" aria-hidden="true" />
                        {country}
                      </Link>
                    </Tap>
                  ))}
                </div>
              </div>
            </div>

            {variant === 'home' && (
              <div className="mt-12 grid gap-3 text-left sm:grid-cols-3">
                {[
                  {
                    Icon: Gem,
                    title: 'Stone to places',
                    text: 'Search a stone and watch every known locality appear on the map.',
                  },
                  {
                    Icon: Globe2,
                    title: 'Country to stones',
                    text: 'Pick a country and see which stones are found there.',
                  },
                  {
                    Icon: Smartphone,
                    title: 'Works like an app',
                    text: 'Add Pathor-Ko to your home screen for a full-screen experience.',
                  },
                ].map(({ Icon, title, text }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut', delay: 0.1 + i * 0.05 }}
                    className="glass rounded-3xl p-5"
                  >
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber/10 text-amber-gold">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{text}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------- results ---------------------------- */
  const visibleStones = showAll ? stones : stones.slice(0, 4);

  return (
    <div className="pb-nav mx-auto max-w-[1600px] px-4 pt-5 md:px-6">
      {searchBar}

      <div className="mt-6 md:flex md:items-start md:gap-6">
        {filterPanel}

        <div className="min-w-0 space-y-7 md:w-[26rem] md:shrink-0 xl:w-[30rem]">
          {search.loading && !search.data && (
            <>
              <BrandLoader label="Searching the earth…" />
              <SkeletonList count={4} />
            </>
          )}

          {search.error && <ErrorNotice error={search.error} onRetry={search.retry} />}

          {search.data && stones.length === 0 && (
            <EmptyState
              title="No stones found"
              hint="Try a different search, or loosen a filter."
            />
          )}

          {stones.length > 0 && (
            <section aria-label="Matching stones" className="space-y-3">
              <div className="flex items-baseline justify-between px-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  {search.data?.count ?? stones.length}{' '}
                  {(search.data?.count ?? stones.length) === 1 ? 'stone' : 'stones'}
                </h2>
                <span className="text-xs text-zinc-500">Tap one to map it</span>
              </div>
              <div className="space-y-2.5">
                {visibleStones.map((stone, i) => (
                  <StoneCard
                    key={stone.id}
                    stone={stone}
                    index={i}
                    selected={stone.id === selectedId}
                    onSelect={(s) => {
                      setSelectedId(s.id);
                      setMobileView('list');
                    }}
                  />
                ))}
              </div>
              {(stones.length > 4 || hasMoreStones) && (
                <div className="flex flex-wrap gap-2">
                  {stones.length > 4 && (
                    <Tap>
                      <button type="button" className="btn-ghost" onClick={() => setShowAll((v) => !v)}>
                        {showAll ? 'Show fewer' : `Show all ${stones.length}`}
                      </button>
                    </Tap>
                  )}
                  {showAll && hasMoreStones && (
                    <Tap>
                      <button type="button" className="btn-ghost" onClick={() => void loadMoreStones()} disabled={loadingMore}>
                        {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                        Load more stones
                      </button>
                    </Tap>
                  )}
                </div>
              )}
            </section>
          )}

          {selectedId && selectedStone && (
            <section aria-label="Localities" className="space-y-3">
              <div className="glass rounded-3xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-gold">
                  Found in
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tighter">{selectedStone.name}</h2>
                {selectedStone.formula && (
                  <p className="mt-0.5 text-amber-gold/90">
                    <Formula value={selectedStone.formula} />
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-zinc-400">
                    {detailForSelected
                      ? `${detailForSelected.localities.count.toLocaleString()} localities`
                      : 'Loading localities…'}
                  </p>
                  <Tap>
                    <Link href={`/stone/${selectedId}`} className="btn-ghost text-sm">
                      Stone details
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Tap>
                </div>
              </div>

              {detail.loading && !detailForSelected && <SkeletonList count={4} />}
              {detail.error && <ErrorNotice error={detail.error} onRetry={detail.retry} />}
              {detailForSelected && <LocalityList localities={localities} />}

              {hasMoreLocalities && (
                <Tap>
                  <button
                    type="button"
                    className="btn-ghost w-full"
                    onClick={() => void loadMoreLocalities()}
                    disabled={loadingMore}
                  >
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    Load more localities
                  </button>
                </Tap>
              )}
            </section>
          )}
        </div>

        {/* Map: sticky column on desktop, toggleable full-screen view on mobile */}
        <div
          className={`${
            mobileView === 'map'
              ? 'fixed inset-x-0 top-[calc(3rem+env(safe-area-inset-top))] bottom-[calc(var(--nav-h)+env(safe-area-inset-bottom))] z-40 block bg-[#0a0a0f] p-2'
              : 'hidden'
          } md:sticky md:inset-auto md:top-24 md:z-auto md:block md:h-[calc(100dvh-7rem)] md:min-w-0 md:flex-1 md:bg-transparent md:p-0`}
        >
          <div className="relative h-full w-full">
            <MapView points={points} />
            <div className="pointer-events-none absolute left-3 top-3 z-[500] flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0a0a0f]/80 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-xl">
              {detail.loading && selectedId ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-gold" aria-hidden="true" />
              ) : (
                <CrystalIcon size={14} glow={false} />
              )}
              {points.length.toLocaleString()} on the map
            </div>
          </div>
        </div>
      </div>

      {stones.length > 0 && (
        <div
          className="pointer-events-none fixed inset-x-0 z-[45] flex justify-center md:hidden"
          style={{ bottom: 'calc(var(--nav-h) + env(safe-area-inset-bottom) + 0.75rem)' }}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setMobileView((v) => (v === 'map' ? 'list' : 'map'))}
            className="btn-primary pointer-events-auto select-none px-6 shadow-soft"
          >
            {mobileView === 'map' ? (
              <>
                <List className="h-4 w-4" aria-hidden="true" /> List
              </>
            ) : (
              <>
                <MapIcon className="h-4 w-4" aria-hidden="true" /> Map
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}
