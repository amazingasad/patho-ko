'use client';

import dynamic from 'next/dynamic';
import { SkeletonMap } from './LoadingSkeleton';
import type { MapInnerProps } from './MapInner';

// Leaflet touches `window`, so it is only ever loaded in the browser.
const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => <SkeletonMap />,
});

export default function MapView(props: MapInnerProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-soft">
      <MapInner {...props} />
    </div>
  );
}
