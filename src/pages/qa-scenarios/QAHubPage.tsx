import { Link } from 'react-router-dom';

const QAHubPage = () => {
  const scenarios = [
    {
      title: 'Component Playground',
      description: 'Test various UI components, forms, and interactive elements',
      path: '/playground',
      icon: '🧩',
      tags: ['Forms', 'Buttons', 'Modals', 'Drag & Drop'],
      color: 'bg-purple-500',
    },
    {
      title: 'E-commerce Product Page',
      description: 'Complete online shopping experience with product details, reviews, and cart',
      path: '/qa/ecommerce',
      icon: '🛍️',
      tags: ['Shopping Cart', 'Reviews', 'Filters', 'Image Gallery'],
      color: 'bg-blue-500',
    },
    {
      title: 'Banking Dashboard',
      description: 'Financial dashboard with accounts, transactions, and transfers',
      path: '/qa/banking',
      icon: '💳',
      tags: ['Transactions', 'Security', 'Charts', 'Modals'],
      color: 'bg-green-500',
    },
    {
      title: 'Social Media Feed',
      description: 'Social platform with posts, comments, likes, and sharing',
      path: '/qa/social',
      icon: '📱',
      tags: ['Posts', 'Comments', 'Stories', 'Real-time'],
      color: 'bg-pink-500',
    },
    {
      title: 'Booking System',
      description: 'Multi-step appointment booking with calendar and time slots',
      path: '/qa/booking',
      icon: '📅',
      tags: ['Calendar', 'Multi-step', 'Validation', 'Time Slots'],
      color: 'bg-orange-500',
    },
  ];

  const testingTips = [
    {
      title: 'Form Validation',
      description: 'Test required fields, email formats, and error messages',
      icon: '✅',
    },
    {
      title: 'Responsive Design',
      description: 'Check layouts on different screen sizes and devices',
      icon: '📱',
    },
    {
      title: 'User Interactions',
      description: 'Verify clicks, hovers, and keyboard navigation',
      icon: '🖱️',
    },
    {
      title: 'Data Persistence',
      description: 'Ensure data is saved and retrieved correctly',
      icon: '💾',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              QA Testing Playground Hub
            </h1>
            <p className="text-lg text-gray-600">
              Practice automated testing on real-world application scenarios
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Test Scenarios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => (
              <Link
                key={index}
                to={scenario.path}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative"
                data-testid={`scenario-card-${index}`}
              >
                <div className={`h-2 ${scenario.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-3">{scenario.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {scenario.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{scenario.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Start Testing</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Testing Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Testing Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testingTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                data-testid={`tip-card-${index}`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{tip.icon}</span>
                  <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features for Testing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features Available for Testing</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Authentication & Security</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Login/Logout flows
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    PIN verification
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Session management
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Forms & Validation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Multi-step forms
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Field validation
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    File uploads
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Interactive Elements</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Modals & Dialogs
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Drag & Drop
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Toast notifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How to use this playground:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Choose a test scenario from the cards above</li>
                  <li>Explore the page functionality and interactions</li>
                  <li>All elements have data-testid attributes for easy test automation</li>
                  <li>Use browser DevTools to inspect elements and selectors</li>
                  <li>Practice writing automated tests using Playwright, Cypress, or Selenium</li>
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