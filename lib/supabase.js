import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Database helpers
export const saveArticle = async (userId, article) => {
  const { data, error } = await supabase
    .from('saved_articles')
    .insert([
      {
        user_id: userId,
        title: article.title,
        description: article.description,
        url: article.url,
        image_url: article.urlToImage,
        published_at: article.publishedAt,
        source: article.source?.name,
        category: article.category || 'general'
      }
    ]);
  return { data, error };
};

export const getSavedArticles = async (userId) => {
  const { data, error } = await supabase
    .from('saved_articles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const removeSavedArticle = async (userId, articleUrl) => {
  const { error } = await supabase
    .from('saved_articles')
    .delete()
    .eq('user_id', userId)
    .eq('url', articleUrl);
  return { error };
};

export const addComment = async (userId, articleUrl, content) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        user_id: userId,
        article_url: articleUrl,
        content: content
      }
    ]);
  return { data, error };
};

export const getComments = async (articleUrl) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('article_url', articleUrl)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateUserPreferences = async (userId, preferences) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert([
      {
        user_id: userId,
        categories: preferences.categories,
        language: preferences.language,
        notifications_enabled: preferences.notifications_enabled
      }
    ]);
  return { data, error };
};

export const getUserPreferences = async (userId) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};