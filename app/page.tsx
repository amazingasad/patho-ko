import { Suspense } from 'react';
import Explorer from '@/components/Explorer';
import { SkeletonDetail } from '@/components/LoadingSkeleton';

export default function HomePage() {
  return (
    <Suspense fallback={<SkeletonDetail />}>
      <Explorer variant="home" />
    </Suspense>
  );
}
