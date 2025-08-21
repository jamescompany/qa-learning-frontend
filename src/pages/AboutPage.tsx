import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('about.title')}</h1>
      
      <div>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('about.mission.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('about.mission.description')}
          </p>
        </section>

        <section className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t('about.features.learning.icon')} {t('about.features.learning.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.features.learning.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t('about.features.community.icon')} {t('about.features.community.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.features.community.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t('about.features.tasks.icon')} {t('about.features.tasks.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.features.tasks.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t('about.features.progress.icon')} {t('about.features.progress.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.features.progress.description')}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow min-h-[250px] flex items-center">
            <div className="p-8 w-full">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('about.getStarted.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('about.getStarted.description')}
              </p>
              <div className="flex gap-4">
                {!isAuthenticated && (
                  <Link to="/signup" className="btn btn-primary">
                    {t('about.getStarted.signUpNow')}
                  </Link>
                )}
                <Link to="/qa" className="btn btn-secondary">
                  {t('about.getStarted.qaTestingPlayground')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow min-h-[250px] flex items-center">
            <div className="p-8 w-full">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('about.contact.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.contact.description')}
                <br />
                <a href="mailto:support@qalearningweb.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  support@qalearningweb.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;