// Import page-specific translations
import { home } from './home';
import { auth } from './auth';
import { about } from './about';
import { dashboard } from './dashboard';
import { todos } from './todos';
// import { posts } from './posts';
// import { calendar } from './calendar';
// import { kanban } from './kanban';
// import { chat } from './chat';
// import { settings } from './settings';
// import { profile } from './profile';
// import { privacy } from './privacy';
// import { terms } from './terms';
// import { qa } from './qa';

// Combine all translations
const ko = {
  home,
  auth,
  about,
  dashboard,
  todos,
  // Add more page translations here
  // posts,
  // calendar,
  // kanban,
  // chat,
  // settings,
  // profile,
  // privacy,
  // terms,
  // qa,
  
  // Keep existing translations that haven't been modularized yet
  privacyPolicy: {
    title: '개인정보 처리방침',
    section1: {
      title: '1. 수집하는 정보',
      description: '우리는 계정 생성, 콘텐츠 제출, 지원 요청 시 고객님이 직접 제공하는 정보를 수집합니다.',
      items: [
        '계정 정보 (이름, 이메일, 비밀번호)',
        '프로필 정보 (자기소개, 아바타, 위치)',
        '생성한 콘텐츠 (게시물, 댓글, 할 일)',
        '우리와의 커뮤니케이션',
      ],
    },
    section2: {
      title: '2. 정보 사용 방법',
      description: '수집한 정보는 다음과 같은 목적으로 사용합니다.',
      items: [
        '서비스 제공, 유지 및 개선',
        '기술 공지 및 지원 메시지 전송',
        '고객님의 의견 및 질문에 대한 응답',
        '사기 또는 불법 활동으로부터 보호',
      ],
    },
  },
  termsOfService: {
    title: '이용약관',
    lastUpdated: '최종 업데이트',
    section1: {
      title: '1. 약관 동의',
      description: 'QA Learning Web에 접속하거나 사용함으로써, 귀하는 이러한 이용약관에 구속되는 것에 동의합니다.',
    },
    section2: {
      title: '2. 서비스 사용',
      description: '귀하는 법적 목적으로만 서비스를 사용하는 데 동의하며, 서비스 또는 다른 사용자의 서비스 사용을 방해하거나 손상시킬 수 있는 방식으로 사용하지 않기로 동의합니다.',
    },
  },
  notFound: {
    title: '404 - 페이지를 찾을 수 없습니다',
    description: '죄송합니다. 찾고 계신 페이지가 존재하지 않습니다.',
    goHome: '홈으로 돌아가기',
  },
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    cancel: '취소',
    save: '저장',
    delete: '삭제',
    edit: '수정',
    create: '만들기',
    submit: '제출',
    close: '닫기',
    yes: '예',
    no: '아니요',
    search: '검색',
    filter: '필터',
    sort: '정렬',
    actions: '작업',
  },
};

export default ko;