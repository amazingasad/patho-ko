'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { crystalSvgString } from './Logo';
import { flagEmoji } from '@/lib/countries';
import type { MapPoint } from '@/lib/types';

export interface MapInnerProps {
  points: MapPoint[];
  className?: string;
  /** Zoom used when there is only one point. */
  singleZoom?: number;
  showPopups?: boolean;
  scrollWheelZoom?: boolean;
}

const pinIcon = L.divIcon({
  className: 'pk-pin',
  html: `<div>${crystalSvgString(34)}</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -30],
});

function clusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 38 : count < 100 ? 44 : 50;
  return L.divIcon({
    html: `<div>${count}</div>`,
    className: 'pk-cluster',
    iconSize: L.point(size, size),
  });
}

function FitBounds({ points, singleZoom }: { points: MapPoint[]; singleZoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], singleZoom, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 9, animate: true });
  }, [map, points, singleZoom]);

  return null;
}

function ResizeWatcher() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function MapInner({
  points,
  className = '',
  singleZoom = 6,
  showPopups = true,
  scrollWheelZoom = true,
}: MapInnerProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      scrollWheelZoom={scrollWheelZoom}
      zoomControl
      className={`h-full w-full rounded-2xl ${className}`}
      style={{ minHeight: 240 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />
      <FitBounds points={points} singleZoom={singleZoom} />
      <ResizeWatcher />
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={false}
        maxClusterRadius={48}
        iconCreateFunction={clusterIcon}
      >
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon} riseOnHover>
            {showPopups && (
              <Popup>
                <div className="min-w-[160px] space-y-1">
                  <p className="text-sm font-semibold tracking-tight text-zinc-50">{p.name}</p>
                  {p.country && (
                    <p className="text-xs text-zinc-400">
                      {flagEmoji(p.country)} {p.country}
                    </p>
                  )}
                  <Link
                    href={`/locality/${p.id}`}
                    className="mt-2 inline-flex min-h-[36px] items-center rounded-xl bg-amber/20 px-3 text-xs font-semibold text-amber-gold"
                  >
                    View details →
                  </Link>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
