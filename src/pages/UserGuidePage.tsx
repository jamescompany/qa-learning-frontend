import React from 'react';
import { Link } from 'react-router-dom';

const UserGuidePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QA Learning 101 가이드북
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            자동화 테스트 학습을 위한 완벽한 놀이터
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            소개
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>QA Learning 101</strong>은 자동화 테스트 학습을 목적으로 구현된 종합 테스트 플레이그라운드입니다. 
              실제 서비스와 유사한 환경에서 다양한 테스트 시나리오를 연습할 수 있도록 설계되었습니다.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm">
                💡 <strong>Tip:</strong> 모든 페이지는 자동화 테스트에 자유롭게 사용 가능합니다. 
                실제 데이터가 아닌 테스트 데이터이므로 마음껏 테스트하세요!
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            핵심 기능
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">다국어 지원</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                한국어/영어 언어 전환 기능으로 국제화 테스트 가능
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">테마 전환</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                라이트/다크 모드 전환으로 UI 테마 테스트 가능
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">data-testid 속성</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                자동화 테스트를 위한 data-testid 속성이 모든 주요 요소에 적용
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">반응형 디자인</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                모바일, 태블릿, 데스크톱 모든 환경에서 테스트 가능
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            대시보드 섹션
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            일반적인 웹 애플리케이션 기능들을 테스트할 수 있는 섹션입니다.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">📝</span>
              <div>
                <strong className="text-gray-900 dark:text-white">게시물</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">CRUD 작업, 페이지네이션, 필터링 등 게시판 기능 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✅</span>
              <div>
                <strong className="text-gray-900 dark:text-white">할 일</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">Todo List의 추가, 수정, 삭제, 완료 처리 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">📅</span>
              <div>
                <strong className="text-gray-900 dark:text-white">캘린더</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">날짜 선택, 이벤트 관리 등 달력 컴포넌트 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">📋</span>
              <div>
                <strong className="text-gray-900 dark:text-white">칸반 보드</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">드래그 앤 드롭, 상태 변경 등 칸반 보드 기능 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">💬</span>
              <div>
                <strong className="text-gray-900 dark:text-white">채팅</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">실시간 메시징, 알림 등 채팅 기능 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">⚙️</span>
              <div>
                <strong className="text-gray-900 dark:text-white">설정</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">프로필 업데이트, 비밀번호 변경 등 설정 페이지 테스트</p>
              </div>
            </div>
          </div>
        </div>

        {/* QA Testing Playground */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            QA 테스팅 플레이그라운드
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            실제 서비스와 유사한 복잡한 테스트 시나리오를 연습할 수 있는 전문 테스트 환경입니다.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-purple-600 dark:text-purple-400 mr-2">🧪</span>
              <div>
                <strong className="text-gray-900 dark:text-white">컴포넌트 플레이그라운드</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">버튼, 폼, 모달 등 다양한 UI 컴포넌트의 상호작용 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 dark:text-purple-400 mr-2">🛒</span>
              <div>
                <strong className="text-gray-900 dark:text-white">이커머스 플랫폼</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">상품 검색, 장바구니, 결제 프로세스 등 온라인 쇼핑몰 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 dark:text-purple-400 mr-2">🏦</span>
              <div>
                <strong className="text-gray-900 dark:text-white">뱅킹 대시보드</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">계좌 조회, 이체, 거래 내역 등 금융 서비스 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 dark:text-purple-400 mr-2">👥</span>
              <div>
                <strong className="text-gray-900 dark:text-white">소셜 미디어 피드</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">포스팅, 좋아요, 댓글 등 소셜 네트워크 기능 테스트</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 dark:text-purple-400 mr-2">📋</span>
              <div>
                <strong className="text-gray-900 dark:text-white">예약 시스템</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">날짜/시간 선택, 예약 확인 등 예약 플랫폼 테스트</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              🚀 추후 더 많은 테스트 환경이 추가될 예정입니다!
            </p>
          </div>
        </div>

        {/* API Documentation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            백엔드 API 테스트
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            프론트엔드 테스트뿐만 아니라 백엔드 API 테스트를 위한 완벽한 문서도 제공됩니다.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              RESTful API 엔드포인트, 요청/응답 형식, 인증 방법 등 API 자동화 테스트에 필요한 모든 정보가 포함되어 있습니다.
            </p>
            <a 
              href={(() => {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
                const baseUrl = apiUrl.replace('/api/v1', '');
                return `${baseUrl}/docs`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              API 문서 보기 →
            </a>
          </div>
        </div>

        {/* Recommended Testing Areas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            추천 테스트 영역
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">초급자</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 로그인/회원가입 폼 유효성 검증</li>
                <li>• Todo List CRUD 작업</li>
                <li>• 기본 검색 기능</li>
              </ul>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">중급자</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 칸반 보드 드래그 앤 드롭</li>
                <li>• 이커머스 장바구니 플로우</li>
                <li>• 실시간 채팅 기능</li>
              </ul>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">고급자</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 복잡한 예약 시스템 시나리오</li>
                <li>• 뱅킹 대시보드 트랜잭션 검증</li>
                <li>• End-to-End 테스트 시나리오</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            제안 및 피드백
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              더 나은 테스트 환경을 만들기 위해 여러분의 의견을 기다립니다!
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-semibold mb-2">추가되었으면 하는 기능이 있나요?</p>
              <ul className="text-sm space-y-1">
                <li>• 새로운 테스트 시나리오</li>
                <li>• 특정 산업군 테스트 환경</li>
                <li>• 자동화 도구 통합 가이드</li>
                <li>• 성능 테스트 환경</li>
              </ul>
            </div>
            <Link 
              to="/contact" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              제안하기
            </Link>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            교육 프로그램 안내
          </h2>
          <p className="mb-4">
            QA 자동화 테스트 전문 교육 과정이 곧 제임스컴퍼니를 통해 제공될 예정입니다.
          </p>
          <div className="text-sm opacity-90">
            <p>• 실무 중심의 자동화 테스트 교육</p>
            <p>• Selenium, Cypress, Playwright 실습</p>
            <p>• API 테스트 및 성능 테스트</p>
            <p>• 실제 프로젝트 기반 학습</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>QA Learning 101 - Your Automation Testing Playground</p>
          <p className="mt-2">Made with ❤️ for QA Engineers</p>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage;