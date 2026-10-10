import { NextRequest, NextResponse } from 'next/server';
import { badRequest, errorResponse, parsePage } from '@/lib/api';
import { searchGeomaterial } from '@/lib/stones';

// GET /api/stone?q=quartz&el_inc=Fe,Cu&hardness_min=5&hardness_max=8&csystem=Cubic&color=Red&page=1
export async function GET(request: NextRequest) {

  const sp = request.nextUrl.searchParams;
  const q = (sp.get('q') ?? '').trim();
  const elements = (sp.get('el_inc') ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  const hardnessMin = parseFloat(sp.get('hardness_min') ?? '');
  const hardnessMax = parseFloat(sp.get('hardness_max') ?? '');
  const crystalSystem = (sp.get('csystem') ?? '').trim();
  const color = (sp.get('color') ?? '').trim();

  const hasFilters =
    elements.length > 0 ||
    Number.isFinite(hardnessMin) ||
    Number.isFinite(hardnessMax) ||
    Boolean(crystalSystem) ||
    Boolean(color);

  if (!q && !hasFilters) {
    return badRequest('Type a stone name or pick at least one filter.');
  }

  try {
    const data = await searchGeomaterial(
      q,
      {
        elements,
        hardnessMin: Number.isFinite(hardnessMin) ? hardnessMin : 1,
        hardnessMax: Number.isFinite(hardnessMax) ? hardnessMax : 10,
        crystalSystem,
        color,
      },
      parsePage(sp.get('page')),
    );
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
