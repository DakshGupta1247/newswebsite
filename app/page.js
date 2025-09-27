'use client';

import { useNews } from '@/contexts/NewsContext';
import { NewsCard } from '@/components/NewsCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TrendingSection } from '@/components/TrendingSection';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { Button } from '@/components/ui/Button';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function Home() {
  const { 
    articles, 
    loading, 
    error, 
    searchQuery, 
    searchResults, 
    hasMore,
    fetchNews,
    currentCategory,
    refreshNews
  } = useNews();

  const displayArticles = searchQuery ? searchResults : articles;
  const isSearching = searchQuery && searchResults.length > 0;

  const handleLoadMore = () => {
    if (!searchQuery) {
      fetchNews(currentCategory, true);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <Button onClick={refreshNews}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Stay Informed
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-6">
          Your personalized news experience
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={refreshNews}
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh News
          </Button>
        </div>
      </section>

      {/* Trending Section */}
      {!isSearching && <TrendingSection />}

      {/* Category Filter */}
      {!isSearching && <CategoryFilter />}

      {/* Search Results Header */}
      {isSearching && (
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {searchResults.length} articles found
          </p>
        </div>
      )}

      {/* News Grid */}
      {loading && displayArticles.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article, index) => (
              <NewsCard
                key={`${article.url}-${index}`}
                article={{ ...article, category: currentCategory }}
              />
            ))}
          </div>
          
          {!isSearching && (
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={loading}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isSearching 
              ? 'Try searching with different keywords'
              : 'Check back later for new articles'
            }
          </p>
        </div>
      )}
    </div>
  );
}
