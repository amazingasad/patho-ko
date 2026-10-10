'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Maximize2, MapPinOff, X } from 'lucide-react';
import MapView from '@/components/MapView';
import Tap from '@/components/Tap';
import { SkeletonDetail } from '@/components/LoadingSkeleton';
import { ErrorNotice } from '@/components/States';
import { flagEmoji } from '@/lib/countries';
import { useApi } from '@/lib/useApi';
import type { LocalityResponse, MapPoint } from '@/lib/types';

function formatCoords(lat: number, lng: number): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

export default function LocalityDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, error, loading, retry } = useApi<LocalityResponse>(`/api/locality/${params.id}`);
  const [fullscreen, setFullscreen] = useState(false);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <ErrorNotice error={error} onRetry={retry} />
      </div>
    );
  }
  if (loading || !data) return <SkeletonDetail />;

  const loc = data.locality;
  const hasCoords = loc.latitude != null && loc.longitude != null;
  const points: MapPoint[] = hasCoords
    ? [
        {
          id: loc.id,
          name: loc.name,
          country: loc.country,
          lat: loc.latitude as number,
          lng: loc.longitude as number,
        },
      ]
    : [];

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
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-3 text-4xl" aria-hidden="true">
            {flagEmoji(loc.country)}
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tighter md:text-6xl">{loc.name}</h1>
          {loc.country && <p className="mt-2 text-lg text-amber-gold">{loc.country}</p>}
          {loc.description && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
              {loc.description}
            </p>
          )}
        </div>
      </motion.section>

      <section aria-label="Location" className="grid gap-3 md:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Full address</p>
          <p className="mt-1.5 text-[15px] leading-snug text-zinc-100">{loc.address}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Coordinates</p>
          {hasCoords ? (
            <>
              <p className="mt-1.5 text-[15px] text-zinc-100">
                {formatCoords(loc.latitude as number, loc.longitude as number)}
              </p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${loc.latitude}&mlon=${loc.longitude}#map=12/${loc.latitude}/${loc.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-amber-gold underline-offset-4 hover:underline"
              >
                Open in OpenStreetMap <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </>
          ) : (
            <p className="mt-1.5 flex items-center gap-2 text-[15px] text-zinc-500">
              <MapPinOff className="h-4 w-4" aria-hidden="true" /> No coordinates recorded
            </p>
          )}
        </div>
      </section>

      {hasCoords && (
        <section aria-label="Map" className="relative h-[55dvh] min-h-[320px]">
          <MapView points={points} singleZoom={9} />
          <div className="absolute right-3 top-3 z-[500]">
            <Tap>
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                aria-label="Open full-screen map"
                className="btn-ghost h-11 w-11 !bg-[#0a0a0f]/80 !px-0"
              >
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </Tap>
          </div>
        </section>
      )}

      <section aria-label="Stones found here" className="space-y-4">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="text-2xl font-semibold tracking-tighter">Stones found here</h2>
          <span className="text-sm text-zinc-500">{loc.stones.length.toLocaleString()}</span>
        </div>
        {loc.stones.length === 0 ? (
          <p className="glass rounded-2xl px-4 py-6 text-center text-sm text-zinc-400">
            No stones are listed for this locality yet.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {loc.stones.map((stone, i) => (
              <motion.li
                key={stone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut', delay: Math.min(i, 20) * 0.05 }}
                whileTap={{ scale: 0.96 }}
                className="will-change-transform"
              >
                <Link href={`/stone/${stone.id}`} className="chip">
                  {stone.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      {hasCoords && (
        <p className="text-center text-xs text-zinc-600">
          Coordinates are approximate.{' '}
          <a
            href={`https://www.openstreetmap.org/?mlat=${loc.latitude}&mlon=${loc.longitude}#map=11/${loc.latitude}/${loc.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 underline-offset-4 hover:underline"
          >
            Open in OpenStreetMap
          </a>
        </p>
      )}

      <AnimatePresence>
        {fullscreen && hasCoords && (
          <motion.div
            key="fullscreen-map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[80] bg-[#0a0a0f] p-2"
            style={{
              paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)',
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)',
            }}
          >
            <MapView points={points} singleZoom={10} />
            <div
              className="absolute right-4 z-[500]"
              style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
            >
              <Tap>
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  aria-label="Close full-screen map"
                  className="btn-ghost h-11 w-11 !bg-[#0a0a0f]/80 !px-0"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Tap>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
