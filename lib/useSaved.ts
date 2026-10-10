'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { SavedStone } from './types';

const KEY = 'pathorko:saved';
const EMPTY: SavedStone[] = [];
const listeners = new Set<() => void>();
let cache: SavedStone[] | null = null;

function read(): SavedStone[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? (parsed as SavedStone[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function write(list: SavedStone[]) {
  cache = list;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage can be unavailable (private mode) — keep the in-memory copy */
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      emit();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);

  const isSaved = useCallback(
    (id: number) => saved.some((s) => s.id === id),
    [saved],
  );

  const toggle = useCallback((stone: SavedStone) => {
    const current = read();
    if (current.some((s) => s.id === stone.id)) {
      write(current.filter((s) => s.id !== stone.id));
    } else {
      write([{ id: stone.id, name: stone.name, formula: stone.formula }, ...current]);
    }
  }, []);

  const remove = useCallback((id: number) => {
    write(read().filter((s) => s.id !== id));
  }, []);

  return { saved, isSaved, toggle, remove };
}
