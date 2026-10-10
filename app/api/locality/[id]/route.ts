import { NextRequest, NextResponse } from 'next/server';
import { badRequest, errorResponse } from '@/lib/api';
import { getLocalityById } from '@/lib/stones';
import type { LocalityResponse } from '@/lib/types';

// GET /api/locality/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {

  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest('That locality id does not look right.');

  // Touch the request URL so Next treats this handler as dynamic.
  void request.nextUrl.pathname;

  try {
    const locality = await getLocalityById(id);
    const body: LocalityResponse = { locality };
    return NextResponse.json(body);
  } catch (error) {
    return errorResponse(error);
  }
}
