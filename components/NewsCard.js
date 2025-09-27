'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  MessageCircle,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { formatDate, truncateText, generateSlug } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { saveArticle, removeSavedArticle } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export function NewsCard({ article, saved = false, onSaveToggle }) {
  const [isBookmarked, setIsBookmarked] = useState(saved);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSaveToggle = async () => {
    if (!user) {
      toast.error('Please sign in to save articles');
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await removeSavedArticle(user.id, article.url);
        if (error) throw error;
        setIsBookmarked(false);
        toast.success('Article removed from saved');
      } else {
        const { error } = await saveArticle(user.id, article);
        if (error) throw error;
        setIsBookmarked(true);
        toast.success('Article saved');
      }
      onSaveToggle?.(article.url, !isBookmarked);
    } catch (error) {
      toast.error('Failed to update saved articles');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = article.url;
  const shareTitle = article.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Image */}
        {article.urlToImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Category Badge */}
            {article.category && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                  {article.category}
                </span>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4 flex flex-col h-full">
          {/* Source and Date */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium">{article.source?.name}</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(article.publishedAt)}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
            {truncateText(article.description, 120)}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {/* Read More */}
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                <Eye className="h-4 w-4 mr-1" />
                Read
              </Link>

              {/* Comments */}
              <Link
                href={`/article/${generateSlug(article.title)}`}
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Discuss
              </Link>
            </div>

            <div className="flex items-center space-x-1">
              {/* Save Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveToggle}
                disabled={loading}
                className="p-1.5"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>

              {/* Share Button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-1.5"
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10">
                    <div className="flex space-x-1">
                      <FacebookShareButton url={shareUrl} quote={shareTitle}>
                        <FacebookIcon size={24} round />
                      </FacebookShareButton>
                      <TwitterShareButton url={shareUrl} title={shareTitle}>
                        <TwitterIcon size={24} round />
                      </TwitterShareButton>
                      <LinkedinShareButton url={shareUrl} title={shareTitle}>
                        <LinkedinIcon size={24} round />
                      </LinkedinShareButton>
                      <WhatsappShareButton url={shareUrl} title={shareTitle}>
                        <WhatsappIcon size={24} round />
                      </WhatsappShareButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}