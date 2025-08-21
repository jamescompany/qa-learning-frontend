import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const HomePageKo: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              품질 보증 마스터하기<br />
              <span className="text-blue-600">실습을 통한 학습</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              QA 전문가를 위한 대화형 학습 플랫폼<br />
              테스팅 방법론, 자동화 도구 및 모범 사례를 배우세요.
            </p>
            {isAuthenticated && (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  대시보드로 이동
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QA Testing Playground Section */}
      <section className="bg-gray-50 dark:bg-gray-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <span className="text-3xl">🧪</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              QA 테스팅 플레이그라운드
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line">
              이커머스, 뱅킹, 소셜 미디어, 예약 시스템을 포함한 실제 애플리케이션 시나리오에서 자동화 테스팅을 연습하세요.{'\n'}Playwright, Cypress, Selenium 테스팅에 완벽합니다.
            </p>
            {isAuthenticated ? (
              <Link
                to="/qa"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                QA 테스팅 플레이그라운드로 이동
              </Link>
            ) : (
              <div>
                <p className="text-yellow-400 font-semibold mb-4">
                  🔒 QA 테스팅 플레이그라운드 진입을 위해 로그인이 필요합니다
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    회원가입
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          QA에서 뛰어나기 위한 모든 것
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">대화형 튜토리얼</h3>
            <p className="text-gray-600 dark:text-gray-400">
              실습 연습과 실제 시나리오를 통해 학습하세요.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">테스트 자동화</h3>
            <p className="text-gray-600 dark:text-gray-400">
              인기 있는 자동화 프레임워크와 도구를 마스터하세요.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">진행 상황 추적</h3>
            <p className="text-gray-600 dark:text-gray-400">
              상세한 분석으로 학습 여정을 모니터링하세요.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            QA 경력을 발전시킬 준비가 되셨나요?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            수천 명의 QA 전문가들이 기술을 향상시키고 있습니다.
          </p>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              오늘 학습 시작하기
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePageKo;