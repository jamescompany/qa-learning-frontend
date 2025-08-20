import React from 'react';
import { Link } from 'react-router-dom';

const HomePageKo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            QA 학습 앱에 오신 것을 환영합니다
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            테스팅 기술을 향상시키고 QA 시나리오를 연습해보세요
          </p>
          
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              회원가입
            </Link>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">실제 시나리오</h3>
            <p className="text-gray-600">
              이커머스, 뱅킹, 소셜 미디어 등 실제 애플리케이션 시나리오로 연습하세요
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">대화형 학습</h3>
            <p className="text-gray-600">
              다양한 UI 컴포넌트와 기능을 사용하여 실습 경험을 쌓으세요
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">종합적인 테스팅</h3>
            <p className="text-gray-600">
              기능, 사용성, 접근성 및 성능 테스팅을 배우세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageKo;