'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { LoadingSpinner } from './LoadingSpinner';

export function InfiniteScroll({ onLoadMore, hasMore, loading }) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div ref={ref} className="flex justify-center py-8">
      {loading && <LoadingSpinner />}
    </div>
  );
}