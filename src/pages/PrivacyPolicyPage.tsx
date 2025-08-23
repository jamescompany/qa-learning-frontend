import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('privacyPolicy.title')}</h1>
      
      {/* Educational Notice */}
      {t('privacyPolicy.educationalNotice', { returnObjects: true }) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-3">
            {t('privacyPolicy.educationalNotice.title')}
          </h2>
          <p className="text-yellow-700 dark:text-yellow-500 mb-4">
            {t('privacyPolicy.educationalNotice.description')}
          </p>
          <ul className="list-disc list-inside space-y-2">
            {(t('privacyPolicy.educationalNotice.warnings', { returnObjects: true }) as string[]).map((warning, index) => (
              <li key={index} className="text-yellow-700 dark:text-yellow-500 font-medium">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="prose prose-lg max-w-none space-y-6">
        {/* Section 1 - Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('privacyPolicy.section1.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section1.description')}
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('privacyPolicy.section1.items', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {t('privacyPolicy.section1.warning') && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <p className="text-orange-700 dark:text-orange-400 font-medium">
                {t('privacyPolicy.section1.warning')}
              </p>
            </div>
          )}
        </section>

        {/* Section 2 - How We Use Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('privacyPolicy.section2.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section2.description')}
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
            {(t('privacyPolicy.section2.items', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {t('privacyPolicy.section2.note') && (
            <p className="text-gray-600 dark:text-gray-400 italic">
              {t('privacyPolicy.section2.note')}
            </p>
          )}
        </section>

        {/* Section 3 - Temporary Password Feature */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('privacyPolicy.section3.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section3.description')}
          </p>
          {t('privacyPolicy.section3.tempPasswordInfo') && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <ul className="list-disc list-inside space-y-2">
                {(t('privacyPolicy.section3.tempPasswordInfo', { returnObjects: true }) as string[]).map((info, index) => (
                  <li key={index} className="text-red-700 dark:text-red-400">
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {t('privacyPolicy.section3.securityWarning') && (
            <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-300 font-bold">
                {t('privacyPolicy.section3.securityWarning')}
              </p>
            </div>
          )}
        </section>

        {/* Section 4 - Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('privacyPolicy.section4.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section4.description')}
          </p>
          {t('privacyPolicy.section4.securityInfo') && (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              {(t('privacyPolicy.section4.securityInfo', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          {t('privacyPolicy.section4.reminder') && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-700 dark:text-blue-400 font-medium">
                {t('privacyPolicy.section4.reminder')}
              </p>
            </div>
          )}
        </section>

        {/* Section 5 - User Rights and Responsibilities */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('privacyPolicy.section5.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section5.description')}
          </p>
          {t('privacyPolicy.section5.rights') && (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Your Rights:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
                {(t('privacyPolicy.section5.rights', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {t('privacyPolicy.section5.responsibilities') && (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Your Responsibilities:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
                {(t('privacyPolicy.section5.responsibilities', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Section 6 - Cookies and Tracking */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('privacyPolicy.section6.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('privacyPolicy.section6.description')}
          </p>
          {t('privacyPolicy.section6.cookieInfo') && (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              {(t('privacyPolicy.section6.cookieInfo', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Section 7 - Policy Changes */}
        {t('privacyPolicy.section7') && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t('privacyPolicy.section7.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('privacyPolicy.section7.description')}
            </p>
            {t('privacyPolicy.section7.changes') && (
              <p className="text-gray-600 dark:text-gray-400">
                {t('privacyPolicy.section7.changes')}
              </p>
            )}
          </section>
        )}

        {/* Section 8 - Contact Us */}
        {t('privacyPolicy.section8') && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t('privacyPolicy.section8.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('privacyPolicy.section8.description')}
              <br />
              <a 
                href={`mailto:${t('privacyPolicy.section8.email')}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('privacyPolicy.section8.email')}
              </a>
            </p>
            {t('privacyPolicy.section8.note') && (
              <p className="text-gray-600 dark:text-gray-400">
                {t('privacyPolicy.section8.note')}
              </p>
            )}
          </section>
        )}

        {/* Last Updated */}
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