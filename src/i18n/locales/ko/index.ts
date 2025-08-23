// Import page-specific translations
import { common } from './common';
import { home } from './home';
import { auth } from './auth';
import { about } from './about';
import { dashboard } from './dashboard';
import { todos } from './todos';
import { banking } from './banking';
import { qa as qaTranslations } from './qa';
import { playground } from './playground';
import { social } from './social';
import { footer } from './footer';
import { sidebar } from './sidebar';
import { posts } from './posts';
import { kanban } from './kanban';
import { chat } from './chat';
import { settings } from './settings';
import { profile } from './profile';
import { privacy } from './privacy';
import { terms } from './terms';
import { activity } from './activity';

// Combine all translations
const ko = {
  ...common,
  common,
  ...home,
  auth,
  about,
  dashboard,
  todos,
  banking,
  social,
  ...qaTranslations,
  ...playground,
  footer,
  sidebar,
  posts,
  kanban,
  chat,
  settings,
  profile,
  privacyPolicy: privacy,
  termsOfService: terms,
  activity,
  // Expose bookingSystem at root level
  bookingSystem: qaTranslations.hub.bookingSystem,
  calendar: {
    title: '캘린더',
    months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    weekDays: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘',
    previous: '이전',
    next: '다음',
    addEvent: '이벤트 추가',
    eventTypes: '이벤트 유형',
    meeting: '회의',
    deadline: '마감일',
    todo: '할 일',
    clickToViewDetails: '상세 정보를 보려면 클릭하세요',
    eventForm: {
      addTitle: '새 이벤트 추가',
      editTitle: '이벤트 수정',
      title: '제목',
      date: '날짜',
      type: '유형',
      time: '시간',
      timeOptional: '시간 (선택사항)',
      description: '설명',
      descriptionOptional: '설명 (선택사항)',
      saveChanges: '변경 사항 저장',
      cancel: '취소',
    },
    eventDetail: {
      title: '이벤트 상세',
      edit: '수정',
      delete: '삭제',
      close: '닫기',
    },
    deleteConfirm: {
      title: '이벤트 삭제',
      message: '"{title}"을(를) 삭제하시겠습니까?',
      warning: '이 작업은 되돌릴 수 없습니다.',
      confirmButton: '삭제',
      cancelButton: '취소',
    },
    more: '개 더보기',
    showAllEvents: '모든 이벤트 보기',
    allEventsForDay: '{{date}} 이벤트',
    noEventsForDay: '이 날짜에 예정된 이벤트가 없습니다',
    view: '보기',
    edit: '수정',
    time: '시간',
    addEventForDay: '이 날짜에 이벤트 추가',
    events: '이벤트',
  },
  // QAHub mapping for compatibility
  qaHub: qaTranslations.qaHub,
  notFound: {
    title: '404',
    heading: '페이지를 찾을 수 없습니다',
    description: '죄송합니다. 찾고 계신 페이지가 존재하지 않습니다.',
    goHome: '홈으로 돌아가기',
    dashboard: '대시보드로 이동',
  },
};

export default ko;