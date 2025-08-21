import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-7xl font-bold text-blue-600 dark:text-blue-400">{t('notFound.title')}</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
          {t('notFound.heading')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4 mb-8 text-base md:text-lg">
          {t('notFound.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            {t('notFound.goHome')}
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg"
          >
            {t('notFound.dashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;