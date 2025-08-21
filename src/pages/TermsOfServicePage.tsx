import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfServicePage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('termsOfService.title')}</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section1.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section1.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section2.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section2.description')}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('termsOfService.section2.restrictions')}</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('termsOfService.section2.restrictionsList', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section3.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section3.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section4.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('termsOfService.section4.description')}</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('termsOfService.section4.prohibitedList', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section5.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section5.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section6.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section6.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section7.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section7.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section8.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section8.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section9.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section9.description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('termsOfService.section10.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section10.description')}
            <br />
            <a 
              href={`mailto:${t('termsOfService.section10.email')}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('termsOfService.section10.email')}
            </a>
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
            {t('termsOfService.lastUpdated')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;