'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react';
import { CrystalIcon } from './Logo';
import Tap from './Tap';
import { SUGGESTED_STONES } from '@/lib/color';
import type { ApiFailure } from '@/lib/useApi';

export function EmptyState({
  title = 'No stones found',
  hint = 'Try a different search',
  showSuggestions = true,
}: {
  title?: string;
  hint?: string;
  showSuggestions?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-10 text-center"
    >
      <div className="relative mb-5 flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-amber/10 blur-xl" />
        <SearchX className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-[#0a0a0f] p-1.5 text-zinc-400" aria-hidden="true" />
        <CrystalIcon size={64} glow={false} className="opacity-60 grayscale-[40%]" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-zinc-400">{hint}</p>
      {showSuggestions && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {SUGGESTED_STONES.map((stone) => (
            <Tap key={stone}>
              <Link href={`/search?q=${encodeURIComponent(stone)}`} className="chip">
                {stone}
              </Link>
            </Tap>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function ErrorNotice({
  error,
  onRetry,
}: {
  error: ApiFailure;
  onRetry?: () => void;
}) {
  const rateLimited = error.code === 'rate_limited';
  const message = rateLimited ? 'Too many requests at once. Try again in a minute.' : error.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-10 text-center"
      role="alert"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/10 text-amber-gold">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold">
        {rateLimited ? 'Taking a breather' : 'That did not work'}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-400">{message}</p>
      {onRetry && (
        <Tap className="mt-6">
          <button type="button" onClick={onRetry} className="btn-primary">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </Tap>
      )}
    </motion.div>
  );
}
