import { NextResponse } from 'next/server';
import { DataError } from './stones';
import type { ApiErrorBody } from './types';

export function errorResponse(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof DataError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status },
    );
  }
  return NextResponse.json(
    { error: 'Something went wrong on our side. Please try again.', code: 'upstream' },
    { status: 500 },
  );
}

export function badRequest(message: string): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: message, code: 'bad_request' }, { status: 400 });
}

export function parsePage(value: string | null): number {
  const n = parseInt(value ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 500) : 1;
}
