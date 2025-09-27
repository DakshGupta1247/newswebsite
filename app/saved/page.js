'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NewsCard } from '@/components/NewsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getSavedArticles } from '@/lib/supabase';
import { Bookmark, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SavedPage() {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedArticles();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSavedArticles = async () => {
    try {
      const { data, error } = await getSavedArticles(user.id);
      if (error) throw error;
      setSavedArticles(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (articleUrl, isSaved) => {
    if (!isSaved) {
      setSavedArticles(prev => prev.filter(article => article.url !== articleUrl));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Bookmark className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sign in to view saved articles
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Create an account to save and organize your favorite news articles
        </p>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

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
          Error loading saved articles
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <Button onClick={fetchSavedArticles}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Saved Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {savedArticles.length} articles saved
          </p>
        </div>
      </div>

      {savedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((article, index) => (
            <NewsCard
              key={`${article.url}-${index}`}
              article={{
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.image_url,
                publishedAt: article.published_at,
                source: { name: article.source },
                category: article.category
              }}
              saved={true}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No saved articles yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start saving articles you want to read later
          </p>
          <Link href="/">
            <Button>Browse News</Button>
          </Link>
        </div>
      )}
    </div>
  );
}