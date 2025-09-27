'use client';

import { useState } from 'react';
import { categories } from '@/lib/newsApi';
import { useNews } from '@/contexts/NewsContext';
import { NewsCard } from '@/components/NewsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Briefcase, 
  Gamepad2, 
  Heart, 
  Microscope, 
  Trophy, 
  Laptop,
  Globe
} from 'lucide-react';

const categoryIcons = {
  general: Globe,
  business: Briefcase,
  entertainment: Gamepad2,
  health: Heart,
  science: Microscope,
  sports: Trophy,
  technology: Laptop
};

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { articles, loading, fetchNews, currentCategory } = useNews();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchNews(category);
  };

  const displayArticles = currentCategory === selectedCategory ? articles : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          News Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse news by category
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isSelected = selectedCategory === category;
          
          return (
            <Card
              key={category}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <CardContent className="p-4 text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${
                  isSelected ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                }`} />
                <h3 className={`font-medium capitalize ${
                  isSelected ? 'text-blue-600' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {category}
                </h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Category Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">
            {selectedCategory} News
          </h2>
          <Button
            onClick={() => fetchNews(selectedCategory)}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article, index) => (
              <NewsCard
                key={`${article.url}-${index}`}
                article={{ ...article, category: selectedCategory }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try refreshing or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}