import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfServicePage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('termsOfService.title')}</h1>
      
      {/* Educational Notice */}
      {t('termsOfService.educationalNotice', { returnObjects: true }) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-3">
            {t('termsOfService.educationalNotice.title')}
          </h2>
          <p className="text-yellow-700 dark:text-yellow-500 mb-4">
            {t('termsOfService.educationalNotice.description')}
          </p>
          <ul className="list-disc list-inside space-y-2">
            {(t('termsOfService.educationalNotice.warnings', { returnObjects: true }) as string[]).map((warning, index) => (
              <li key={index} className="text-yellow-700 dark:text-yellow-500 font-medium">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="prose prose-lg max-w-none space-y-6">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section1.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section1.description')}
          </p>
          {t('termsOfService.section1.additionalInfo') && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('termsOfService.section1.additionalInfo')}
            </p>
          )}
        </section>

        {/* Section 2 - Temporary Password Feature */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section2.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section2.description')}
          </p>
          {t('termsOfService.section2.tempPasswordWarnings') && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <ul className="list-disc list-inside space-y-2">
                {(t('termsOfService.section2.tempPasswordWarnings', { returnObjects: true }) as string[]).map((warning, index) => (
                  <li key={index} className="text-red-700 dark:text-red-400">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {t('termsOfService.section2.restrictions')}
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('termsOfService.section2.restrictionsList', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Section 3 - Data Management */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section3.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section3.description')}
          </p>
          {t('termsOfService.section3.dataPolicy') && (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              {(t('termsOfService.section3.dataPolicy', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Section 4 - Prohibited Activities */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section4.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section4.description')}
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('termsOfService.section4.prohibitedList', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Section 5 - Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section5.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section5.description')}
          </p>
          {t('termsOfService.section5.rights') && (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              {(t('termsOfService.section5.rights', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Section 6 - Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section6.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section6.description')}
          </p>
          {t('termsOfService.section6.disclaimers') && (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              {(t('termsOfService.section6.disclaimers', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Section 7 - Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section7.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section7.description')}
          </p>
          {t('termsOfService.section7.limitations') && (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              {(t('termsOfService.section7.limitations', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Section 8 - Termination */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section8.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section8.description')}
          </p>
        </section>

        {/* Section 9 - Privacy and Security Guidelines */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section9.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section9.description')}
          </p>
          {t('termsOfService.section9.securityGuidelines') && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-2">
                {(t('termsOfService.section9.securityGuidelines', { returnObjects: true }) as string[]).map((guideline, index) => (
                  <li key={index} className="text-blue-700 dark:text-blue-400">
                    {guideline}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Section 10 - Changes to Terms */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section10.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section10.description')}
          </p>
        </section>

        {/* Section 11 - Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('termsOfService.section11.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termsOfService.section11.description')}
            <br />
            <a 
              href={`mailto:${t('termsOfService.section11.email')}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('termsOfService.section11.email')}
            </a>
          </p>
          {t('termsOfService.section11.note') && (
            <p className="text-gray-600 dark:text-gray-400">
              {t('termsOfService.section11.note')}
            </p>
          )}
        </section>

        {/* Last Updated */}
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