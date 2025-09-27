'use client';

import { useEffect, useState } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { newsAPI } from '@/lib/newsApi';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TrendingPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  const fetchTrendingNews = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getTrendingNews();
      setArticles(response.articles || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Error loading trending news
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <Button onClick={fetchTrendingNews}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <TrendingUp className="h-6 w-6 text-red-500 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Trending News
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Most popular stories right now
          </p>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <NewsCard
              key={`${article.url}-${index}`}
              article={article}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No trending articles available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for trending news
          </p>
        </div>
      )}
    </div>
  );
}