import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'post' | 'todo' | 'user';
  url: string;
}

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate search
    setTimeout(() => {
      setResults([
        {
          id: '1',
          title: 'API Testing Best Practices',
          description: 'Learn the essential techniques for effective API testing...',
          type: 'post',
          url: '/posts/1',
        },
        {
          id: '2',
          title: 'Review test cases',
          description: 'Review and update test cases for the new feature',
          type: 'todo',
          url: '/todos',
        },
        {
          id: '3',
          title: 'James Kang',
          description: 'Senior QA Engineer with 5 years of experience',
          type: 'user',
          url: '/profile/james',
        },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '=�';
      case 'todo': return '';
      case 'user': return '=d';
      default: return '=�';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-700';
      case 'todo': return 'bg-green-100 text-green-700';
      case 'user': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('search.title')}</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            🔍
          </button>
        </form>
      </div>

      {/* Search Results */}
      {isSearching ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{t('search.searching')}</p>
          </div>
        ) : hasSearched ? (
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                {t('search.resultCount', { count: results.length, query: searchQuery })}
              </p>
            </div>
            
            {results.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">{t('search.noResults')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.url}
                    className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start">
                      <div className="text-2xl mr-4">{getTypeIcon(result.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {result.title}
                          </h3>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                            {result.type}
                          </span>
                        </div>
                        <p className="text-gray-600">{result.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600">{t('search.placeholder')}</p>
          </div>
        )}
      </div>
  );
};

export default SearchPage;