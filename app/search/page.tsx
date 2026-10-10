import { Suspense } from 'react';
import Explorer from '@/components/Explorer';
import { SkeletonDetail } from '@/components/LoadingSkeleton';

export const metadata = {
  title: 'Search — Pathor-Ko',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SkeletonDetail />}>
      <Explorer variant="search" />
    </Suspense>
  );
}
