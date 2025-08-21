export const qa = {
  hub: {
    title: 'QA 테스팅 플레이그라운드',
    subtitle: '실습을 통한 소프트웨어 테스팅 마스터',
    description: '인터랙티브 테스팅 환경에 오신 것을 환영합니다. 실제 QA 시나리오를 연습하고, 테스팅 기법을 배우며, 기술을 향상시키세요.',
    features: {
      title: '테스트 가능한 항목',
      realWorld: {
        title: '실제 시나리오',
        description: '이커머스, 뱅킹, 소셜 미디어 애플리케이션으로 연습',
      },
      interactive: {
        title: '인터랙티브 컴포넌트',
        description: '폼, 모달, 드래그 앤 드롭, 복잡한 UI 인터랙션 테스트',
      },
      automated: {
        title: '자동화 준비',
        description: 'Selenium, Cypress, Playwright를 위한 테스트 ID 제공',
      },
      responsive: {
        title: '반응형 테스팅',
        description: '다양한 화면 크기와 디바이스에서 테스트',
      },
      authSecurity: {
        title: '인증 및 보안',
        items: [
          '로그인/로그아웃 기능',
          '비밀번호 재설정 플로우',
          '세션 관리',
          '2단계 인증',
          '역할 기반 접근 제어',
        ],
      },
      formsValidation: {
        title: '폼 및 검증',
        items: [
          '필수 필드 검증',
          '이메일 형식 검증',
          '비밀번호 강도 요구사항',
          '다단계 폼 워크플로우',
          '파일 업로드 검증',
        ],
      },
      interactiveElements: {
        title: '인터랙티브 요소',
        items: [
          '드래그 앤 드롭 기능',
          '모달 다이얼로그 및 팝업',
          '실시간 검색 및 필터링',
          '무한 스크롤 페이지네이션',
          '툴팁 및 알림',
        ],
      },
    },
    scenarios: {
      title: '테스팅 시나리오',
      viewDetails: '상세 보기',
      startTesting: '테스팅 시작',
      difficulty: {
        beginner: '초급',
        intermediate: '중급',
        advanced: '고급',
      },
      ecommerce: {
        title: '이커머스 플랫폼',
        description: '장바구니, 결제, 결제 플로우, 재고 관리 테스트',
        features: ['상품 검색 및 필터', '장바구니 관리', '결제 프로세스', '결제 검증', '주문 추적'],
      },
      banking: {
        title: '뱅킹 대시보드',
        description: '금융 거래, 보안 기능, 데이터 검증 테스트',
        features: ['계좌 관리', '거래 내역', '자금 이체', '요금 납부', '보안 테스팅'],
      },
      social: {
        title: '소셜 미디어 피드',
        description: '실시간 업데이트, 사용자 상호작용, 콘텐츠 관리 테스트',
        features: ['게시물 생성', '댓글 및 반응', '실시간 업데이트', '미디어 업로드', '개인정보 설정'],
      },
      booking: {
        title: '여행 예약 시스템',
        description: '복잡한 폼, 날짜 검증, 예약 워크플로우 테스트',
        features: ['항공편 검색', '호텔 예약', '날짜 검증', '가격 계산', '예약 확인'],
      },
      playground: {
        title: '컴포넌트 플레이그라운드',
        description: '개별 UI 컴포넌트와 다양한 상태 테스트',
        features: ['폼 검증', '모달 인터랙션', '드래그 앤 드롭', '파일 업로드', '알림'],
      },
    },
    getStarted: {
      title: '시작하기',
      steps: {
        1: {
          title: '시나리오 선택',
          description: '사전 구축된 테스팅 시나리오를 선택하거나 컴포넌트 플레이그라운드 탐색',
        },
        2: {
          title: '테스트 케이스 읽기',
          description: '각 시나리오에는 상세한 테스트 케이스와 예상 동작이 포함됨',
        },
        3: {
          title: '테스트 실행',
          description: '수동으로 애플리케이션을 테스트하거나 제공된 테스트 ID를 자동화에 사용',
        },
        4: {
          title: '버그 찾기',
          description: '일부 시나리오에는 발견할 수 있는 의도적인 버그가 포함됨',
        },
      },
    },
    tips: {
      title: '테스팅 팁',
      items: [
        '항상 엣지 케이스와 경계값을 확인하세요',
        '긍정적 시나리오와 부정적 시나리오 모두 테스트하세요',
        '오류 메시지와 검증 피드백을 확인하세요',
        '키보드 내비게이션으로 접근성을 확인하세요',
        '다양한 브라우저와 디바이스 조합을 테스트하세요',
        '브라우저 개발자 도구를 사용하여 요소와 네트워크 호출을 검사하세요',
      ],
      formValidation: {
        title: '폼 검증',
        description: '모든 입력 유형과 검증 규칙을 테스트하세요',
      },
      responsiveDesign: {
        title: '반응형 디자인',
        description: '다양한 화면 크기에서 레이아웃을 확인하세요',
      },
      userInteractions: {
        title: '사용자 상호작용',
        description: '클릭, 호버, 키보드 내비게이션을 테스트하세요',
      },
      dataPersistence: {
        title: '데이터 지속성',
        description: '데이터가 올바르게 저장되고 로드되는지 확인하세요',
      },
    },
    learningSupport: '학습 지원',
    testingTips: '테스팅 팁',
    featuresForTesting: '테스팅을 위한 기능',
    quickStartGuide: '빠른 시작 가이드',
    support: {
      message: '테스팅 여정에 도움이 필요하신가요? 저희 지원팀이 QA 기술을 마스터하는 데 도움을 드립니다.',
      email: 'support@qatesting.com',
    },
    quickStart: {
      title: '시작하는 방법',
      steps: [
        '사용 가능한 옵션에서 테스팅 시나리오를 선택하세요',
        '테스트 케이스와 요구사항을 읽으세요',
        '버그를 찾기 위해 애플리케이션과 상호작용하세요',
        '브라우저 개발자 도구를 사용하여 요소를 검사하세요',
        '발견한 내용과 테스트 결과를 문서화하세요',
      ],
    },
  },
  testingGuide: {
    scenarios: '테스트 시나리오',
    tips: '테스팅 팁',
    testIds: '사용 가능한 테스트 ID',
    difficulty: '난이도',
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
    steps: '단계',
    expectedResult: '예상 결과',
    element: '요소',
    description: '설명',
  },
};