'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  Settings,
  Bookmark,
  LogOut,
  Bell
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useNews } from '@/contexts/NewsContext';
import { AuthModal } from './AuthModal';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { searchNews } = useNews();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchNews(searchQuery);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                NewsHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/trending" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Trending
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Categories
              </Link>
              {user && (
                <Link href="/saved" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                  Saved
                </Link>
              )}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </HeadlessMenu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:divide-gray-700">
                      <div className="px-1 py-1">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              href="/saved"
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                            >
                              <Bookmark className="mr-2 h-4 w-4" />
                              Saved Articles
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              href="/settings"
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Sign Out
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  size="sm"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  <Link 
                    href="/" 
                    className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/trending" 
                    className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Trending
                  </Link>
                  <Link 
                    href="/categories" 
                    className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  {user && (
                    <Link 
                      href="/saved" 
                      className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Saved Articles
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}