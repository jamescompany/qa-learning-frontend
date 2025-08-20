import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('about.title')}</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('about.mission.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('about.mission.description')}
          </p>
        </section>

        <section className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('about.features.learning.icon')} {t('about.features.learning.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.features.learning.description')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('about.features.community.icon')} {t('about.features.community.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.features.community.description')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('about.features.tasks.icon')} {t('about.features.tasks.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.features.tasks.description')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('about.features.progress.icon')} {t('about.features.progress.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.features.progress.description')}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('about.getStarted.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('about.getStarted.description')}
          </p>
          <div className="flex gap-4">
            {!isAuthenticated && (
              <Link to="/signup" className="btn btn-primary">
                {t('about.getStarted.signUpNow')}
              </Link>
            )}
            <Link to="/posts" className="btn btn-secondary">
              {t('about.getStarted.browseResources')}
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('about.contact.title')}</h2>
          <p className="text-gray-600">
            {t('about.contact.description')}
            <br />
            {t('about.contact.email')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;