'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { newsAPI } from '@/lib/newsApi';
import { useAuth } from './AuthContext';

const NewsContext = createContext();

const initialState = {
  articles: [],
  savedArticles: [],
  loading: false,
  error: null,
  currentCategory: 'general',
  searchQuery: '',
  searchResults: [],
  trendingArticles: [],
  hasMore: true,
  page: 1
};

function newsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ARTICLES':
      return { 
        ...state, 
        articles: action.payload, 
        loading: false, 
        error: null,
        page: 1,
        hasMore: true
      };
    case 'APPEND_ARTICLES':
      return {
        ...state,
        articles: [...state.articles, ...action.payload],
        loading: false,
        page: state.page + 1,
        hasMore: action.payload.length > 0
      };
    case 'SET_CATEGORY':
      return { ...state, currentCategory: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, loading: false };
    case 'SET_TRENDING':
      return { ...state, trendingArticles: action.payload };
    case 'SET_SAVED_ARTICLES':
      return { ...state, savedArticles: action.payload };
    case 'ADD_SAVED_ARTICLE':
      return { 
        ...state, 
        savedArticles: [action.payload, ...state.savedArticles] 
      };
    case 'REMOVE_SAVED_ARTICLE':
      return {
        ...state,
        savedArticles: state.savedArticles.filter(
          article => article.url !== action.payload
        )
      };
    default:
      return state;
  }
}

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);
  const { user } = useAuth();

  const fetchNews = async (category = 'general', append = false) => {
    try {
      if (!append) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const page = append ? state.page + 1 : 1;
      const response = await newsAPI.getNewsByCategory(category, 20, page);
      
      if (response.articles) {
        const actionType = append ? 'APPEND_ARTICLES' : 'SET_ARTICLES';
        dispatch({ type: actionType, payload: response.articles });
        dispatch({ type: 'SET_CATEGORY', payload: category });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const searchNews = async (query) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await newsAPI.searchNews(query);
      
      if (response.articles) {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.articles });
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await newsAPI.getTrendingNews();
      if (response.articles) {
        dispatch({ type: 'SET_TRENDING', payload: response.articles.slice(0, 5) });
      }
    } catch (error) {
      console.error('Error fetching trending news:', error);
    }
  };

  const refreshNews = () => {
    newsAPI.clearCache();
    fetchNews(state.currentCategory);
  };

  useEffect(() => {
    fetchNews();
    fetchTrending();
  }, []);

  const value = {
    ...state,
    fetchNews,
    searchNews,
    refreshNews,
    fetchTrending,
    dispatch
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};