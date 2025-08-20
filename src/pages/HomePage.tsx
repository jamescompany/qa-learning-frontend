import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('home.hero.title')} <br />
            <span className="text-blue-600"> {t('home.hero.subtitle')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8" style={{ whiteSpace: 'pre-line' }}>
            {t('home.hero.description')}
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('home.hero.goToDashboard')}
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t('home.hero.getStarted')}
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  {t('home.hero.signIn')}
                </Link>
              </>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* QA Testing Hub Section */}
      <section className="bg-gray-500 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <span className="text-3xl">{t('home.qaHub.icon')}</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('home.qaHub.title')}
            </h2>
            <p className="text-lg text-gray-300 mb-6 whitespace-pre-line">
              {t('home.qaHub.description')}
            </p>
            {isAuthenticated ? (
              <Link
                to="/qa"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Access QA Testing Hub
              </Link>
            ) : (
              <div>
                <p className="text-yellow-400 font-semibold mb-4">
                  {t('home.qaHub.loginRequired')}
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {t('home.qaHub.loginToAccess')}
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    {t('home.qaHub.createAccount')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t('home.features.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{t('home.features.interactive.icon')}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.interactive.title')}</h3>
            <p className="text-gray-600">
              {t('home.features.interactive.description')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{t('home.features.automation.icon')}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.automation.title')}</h3>
            <p className="text-gray-600">
              {t('home.features.automation.description')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{t('home.features.tracking.icon')}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.tracking.title')}</h3>
            <p className="text-gray-600">
              {t('home.features.tracking.description')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('home.cta.subtitle')}
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('home.cta.button')}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;