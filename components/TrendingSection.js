'use client';

import { useNews } from '@/contexts/NewsContext';
import { NewsCard } from './NewsCard';
import { TrendingUp } from 'lucide-react';

export function TrendingSection() {
  const { trendingArticles } = useNews();

  if (!trendingArticles.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Trending Now
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {trendingArticles.map((article, index) => (
          <NewsCard
            key={`${article.url}-${index}`}
            article={article}
          />
        ))}
      </div>
    </section>
  );
}