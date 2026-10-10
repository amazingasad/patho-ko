import { NextRequest, NextResponse } from 'next/server';
import { badRequest, errorResponse, parsePage } from '@/lib/api';
import { getLocalitiesByCountry } from '@/lib/stones';

// GET /api/country?name=Brazil&page=1
export async function GET(request: NextRequest) {

  const sp = request.nextUrl.searchParams;
  const name = (sp.get('name') ?? '').trim();
  if (!name) return badRequest('Please provide a country name.');

  try {
    const data = await getLocalitiesByCountry(name, parsePage(sp.get('page')));
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
