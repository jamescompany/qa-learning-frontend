import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('privacyPolicy.title')}</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('privacyPolicy.section1.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section1.description')}
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('privacyPolicy.section1.items', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('privacyPolicy.section2.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section2.description')}
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('privacyPolicy.section2.items', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('privacyPolicy.section3.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section3.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('privacyPolicy.section4.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section4.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('privacyPolicy.section5.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section5.description')}
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('privacyPolicy.section5.items', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('privacyPolicy.section6.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section6.description')}
            <br />
            <a 
              href={`mailto:${t('privacyPolicy.section6.email')}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('privacyPolicy.section6.email')}
            </a>
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
            {t('privacyPolicy.lastUpdated')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;