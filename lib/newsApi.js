const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export const categories = [
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
];

export const countries = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'in', name: 'India' }
];

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }
];

class NewsAPI {
  constructor() {
    this.apiKey = NEWS_API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  async fetchNews(endpoint, params = {}) {
    const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = new URL(`${BASE_URL}${endpoint}`);
      url.searchParams.append('apiKey', this.apiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('News API Error:', error);
      throw error;
    }
  }

  async getTopHeadlines(category = 'general', country = 'us', pageSize = 20, page = 1) {
    return this.fetchNews('/top-headlines', {
      category,
      country,
      pageSize,
      page
    });
  }

  async searchNews(query, language = 'en', sortBy = 'publishedAt', pageSize = 20, page = 1) {
    return this.fetchNews('/everything', {
      q: query,
      language,
      sortBy,
      pageSize,
      page
    });
  }

  async getNewsByCategory(category, pageSize = 20, page = 1) {
    return this.getTopHeadlines(category, 'us', pageSize, page);
  }

  async getTrendingNews() {
    return this.fetchNews('/top-headlines', {
      country: 'us',
      pageSize: 10
    });
  }

  clearCache() {
    this.cache.clear();
  }
}

export const newsAPI = new NewsAPI();