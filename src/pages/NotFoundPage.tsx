import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">{t('notFound.title')}</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">
          {t('notFound.heading')}
        </h2>
        <p className="text-gray-600 mt-4 mb-8">
          {t('notFound.description')}
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('notFound.goHome')}
          </Link>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            {t('notFound.dashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;