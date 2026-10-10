'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Gem, Search, SlidersHorizontal, X } from 'lucide-react';
import { suggestCountries } from '@/lib/countries';

export type SearchMode = 'stone' | 'country';

interface SearchBarProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onToggleFilters?: () => void;
  activeFilterCount?: number;
  autoFocus?: boolean;
  busy?: boolean;
}

export default function SearchBar({
  mode,
  onModeChange,
  value,
  onValueChange,
  onSubmit,
  onToggleFilters,
  activeFilterCount = 0,
  autoFocus = false,
  busy = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const suggestions = mode === 'country' && focused ? suggestCountries(value) : [];

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(value);
    inputRef.current?.blur();
  };

  return (
    <div className="w-full">
      <div
        className="glass relative mx-auto mb-3 grid w-full max-w-md grid-cols-2 rounded-2xl p-1"
        role="tablist"
        aria-label="Search mode"
      >
        {(
          [
            { id: 'stone', label: 'By stone', Icon: Gem },
            { id: 'country', label: 'By country', Icon: Globe2 },
          ] as const
        ).map(({ id, label, Icon }) => {
          const active = mode === id;
          return (
            <motion.button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              whileTap={{ scale: 0.96 }}
              onClick={() => onModeChange(id)}
              className={`tap relative flex select-none items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
                active ? 'text-[#1a1203]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="search-mode-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber to-amber-gold"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className="relative h-4 w-4" aria-hidden="true" />
              <span className="relative">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <form onSubmit={submit} className="relative mx-auto flex w-full max-w-2xl items-center gap-2" role="search">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            placeholder={mode === 'stone' ? 'Try quartz, ruby, gold…' : 'Try Brazil, Namibia, Bangladesh…'}
            aria-label={mode === 'stone' ? 'Search for a stone' : 'Search for a country'}
            className="field h-14 rounded-2xl pl-12 pr-11 text-base [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onValueChange('');
                inputRef.current?.focus();
              }}
              className="tap absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-xl text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="glass-strong absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl"
            >
              {suggestions.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onValueChange(name);
                      onSubmit(name);
                    }}
                    className="tap flex w-full select-none items-center px-4 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        {mode === 'stone' && onToggleFilters && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onToggleFilters}
            aria-label="Open filters"
            className="btn-ghost relative h-14 w-14 shrink-0 select-none !px-0"
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[11px] font-bold text-[#1a1203]">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.96 }}
          disabled={busy}
          className="btn-primary h-14 shrink-0 select-none px-5 disabled:opacity-70"
        >
          Search
        </motion.button>
      </form>
    </div>
  );
}
