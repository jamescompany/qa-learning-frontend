import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../components/common/Header';
import { useAuthStore } from '../../store/authStore';

const QAHubPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const scenarios = [
    {
      title: t('qaHub.scenarios.componentPlayground.title'),
      description: t('qaHub.scenarios.componentPlayground.description'),
      path: '/playground',
      icon: '🧩',
      tags: t('qaHub.scenarios.componentPlayground.tags', { returnObjects: true, defaultValue: [] }) || [],
      color: 'bg-purple-500',
    },
    {
      title: t('qaHub.scenarios.ecommerce.title'),
      description: t('qaHub.scenarios.ecommerce.description'),
      path: '/qa/ecommerce',
      icon: '🛍️',
      tags: t('qaHub.scenarios.ecommerce.tags', { returnObjects: true, defaultValue: [] }) || [],
      color: 'bg-blue-500',
    },
    {
      title: t('qaHub.scenarios.banking.title'),
      description: t('qaHub.scenarios.banking.description'),
      path: '/qa/banking',
      icon: '💳',
      tags: t('qaHub.scenarios.banking.tags', { returnObjects: true, defaultValue: [] }) || [],
      color: 'bg-green-500',
    },
    {
      title: t('qaHub.scenarios.social.title'),
      description: t('qaHub.scenarios.social.description'),
      path: '/qa/social',
      icon: '📱',
      tags: t('qaHub.scenarios.social.tags', { returnObjects: true, defaultValue: [] }) || [],
      color: 'bg-pink-500',
    },
    {
      title: t('qaHub.scenarios.booking.title'),
      description: t('qaHub.scenarios.booking.description'),
      path: '/qa/booking',
      icon: '📅',
      tags: t('qaHub.scenarios.booking.tags', { returnObjects: true, defaultValue: [] }) || [],
      color: 'bg-orange-500',
    },
  ];

  const testingTips = [
    {
      title: t('qaHub.tips.formValidation.title'),
      description: t('qaHub.tips.formValidation.description'),
      icon: '✅',
    },
    {
      title: t('qaHub.tips.responsiveDesign.title'),
      description: t('qaHub.tips.responsiveDesign.description'),
      icon: '📱',
    },
    {
      title: t('qaHub.tips.userInteractions.title'),
      description: t('qaHub.tips.userInteractions.description'),
      icon: '🖱️',
    },
    {
      title: t('qaHub.tips.dataPersistence.title'),
      description: t('qaHub.tips.dataPersistence.description'),
      icon: '💾',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {/* Common Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      
      
      {/* Page Title Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('qaHub.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('qaHub.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Test Scenarios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('qaHub.testScenarios')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => (
              <Link
                key={index}
                to={scenario.path}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative"
                data-testid={`scenario-card-${index}`}
              >
                <div className={`h-2 ${scenario.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-3">{scenario.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                      {scenario.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{scenario.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">{t('qaHub.startTesting')}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Learning Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('qaHub.learningSupport')}</h2>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-purple-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <div>
                <p className="text-gray-800 mb-3">
                  {t('qaHub.support.message')}
                </p>
                <a 
                  href={`mailto:${t('qaHub.support.email')}`}
                  className="inline-flex items-center text-purple-700 hover:text-purple-900 font-medium transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {t('qaHub.support.email')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testing Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('qaHub.testingTips')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testingTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                data-testid={`tip-card-${index}`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{tip.icon}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tip.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features for Testing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('qaHub.featuresForTesting')}</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('qaHub.features.authSecurity.title')}</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {(t('qaHub.features.authSecurity.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('qaHub.features.formsValidation.title')}</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {(t('qaHub.features.formsValidation.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('qaHub.features.interactiveElements.title')}</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {(t('qaHub.features.interactiveElements.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('qaHub.quickStartGuide')}</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">{t('qaHub.quickStart.title')}</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  {(t('qaHub.quickStart.steps', { returnObjects: true }) as string[]).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QAHubPage;