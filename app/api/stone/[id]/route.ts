import { NextRequest, NextResponse } from 'next/server';
import { badRequest, errorResponse, parsePage } from '@/lib/api';
import { getGeomaterialById, getLocalitiesByGeomaterial } from '@/lib/stones';
import type { StoneDetailResponse } from '@/lib/types';

// GET /api/stone/[id]?page=1  ->  { stone, localities }
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {

  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest('That stone id does not look right.');

  const page = parsePage(request.nextUrl.searchParams.get('page'));

  try {
    const [stone, localities] = await Promise.all([
      getGeomaterialById(id),
      getLocalitiesByGeomaterial(id, page),
    ]);
    const body: StoneDetailResponse = { stone, localities };
    return NextResponse.json(body);
  } catch (error) {
    return errorResponse(error);
  }
}
