'use client';

import { categories } from '@/lib/newsApi';
import { Button } from './ui/Button';
import { useNews } from '@/contexts/NewsContext';

export function CategoryFilter() {
  const { currentCategory, fetchNews } = useNews();

  const handleCategoryChange = (category) => {
    fetchNews(category);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mr-2">
        Categories:
      </span>
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange(category)}
          className="capitalize"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}