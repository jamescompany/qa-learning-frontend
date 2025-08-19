import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Quality Assurance <br />
            <span className="text-blue-600"> Through Practice</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Interactive learning platform for QA professionals. <br />
            Learn testing methodologies, automation tools, and best practices.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Sign In
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
              <span className="text-3xl">🧪</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              QA Testing Hub - Exclusive Member Feature
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Practice automated testing on real-world application scenarios including e-commerce, 
              banking, social media, and booking systems. Perfect for Playwright, Cypress, and Selenium testing.
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
                  🔒 Login required to access QA Testing Hub
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Login to Access
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Create Account
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
          Everything You Need to Excel in QA
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Tutorials</h3>
            <p className="text-gray-600">
              Learn through hands-on exercises and real-world scenarios.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Test Automation</h3>
            <p className="text-gray-600">
              Master popular automation frameworks and tools.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Advance Your QA Career?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of QA professionals improving their skills.
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Learning Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;