'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/Toast';
import type { ApiErrorBody, ApiErrorCode } from './types';

export class ApiFailure extends Error {
  code: ApiErrorCode;

  constructor(message: string, code: ApiErrorCode) {
    super(message);
    this.name = 'ApiFailure';
    this.code = code;
  }
}

export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    throw new ApiFailure(
      'Looks like you are offline or Pathor-Ko could not be reached.',
      'network',
    );
  }

  if (!res.ok) {
    let body: Partial<ApiErrorBody> = {};
    try {
      body = (await res.json()) as Partial<ApiErrorBody>;
    } catch {
      body = {};
    }
    const code: ApiErrorCode =
      res.status === 429 ? 'rate_limited' : body.code ?? 'upstream';
    const message =
      code === 'rate_limited'
        ? 'Too many requests at once. Try again in a minute.'
        : body.error ?? 'Something went wrong. Please try again.';
    throw new ApiFailure(message, code);
  }

  return (await res.json()) as T;
}

interface ApiState<T> {
  data: T | null;
  error: ApiFailure | null;
  loading: boolean;
}

export function useApi<T>(url: string | null) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: Boolean(url),
  });
  const [nonce, setNonce] = useState(0);
  const { show } = useToast();
  const showRef = useRef(show);

  useEffect(() => {
    showRef.current = show;
  }, [show]);

  const retry = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!url) {
      setState({ data: null, error: null, loading: false });
      return;
    }
    const controller = new AbortController();
    setState((prev) => ({ data: prev.data, error: null, loading: true }));

    fetchJson<T>(url, controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: unknown) => {
        if ((error as Error).name === 'AbortError') return;
        const failure =
          error instanceof ApiFailure
            ? error
            : new ApiFailure('Something went wrong. Please try again.', 'upstream');
        setState({ data: null, error: failure, loading: false });
        if (failure.code === 'network') {
          showRef.current({
            message: failure.message,
            actionLabel: 'Retry',
            onAction: () => setNonce((n) => n + 1),
          });
        }
      });

    return () => controller.abort();
  }, [url, nonce]);

  return { ...state, retry };
}
