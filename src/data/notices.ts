export interface Notice {
  id: number;
  title: {
    en: string;
    ko: string;
  };
  content: {
    en: string;
    ko: string;
  };
  date: string;
  guide?: {
    steps: {
      en: string[];
      ko: string[];
    };
    note?: {
      en: string;
      ko: string;
    };
  };
}

export const notices: Notice[] = [
  {
    id: 1,
    title: {
      en: 'Swagger Authorize Authentication Method Changed',
      ko: 'Swagger Authorize 인증 방법 변경'
    },
    content: {
      en: 'Changed to maintain only HTTPBearer (http, Bearer). Please follow the authentication guide below.',
      ko: 'HTTPBearer (http, Bearer)만 유지하도록 변경했습니다. 아래 인증 가이드를 따라주세요.'
    },
    date: '2025-08-23',
    guide: {
      steps: {
        en: [
          'Access Swagger documentation',
          'Attempt login at /api/v1/auth/login',
          'Copy the access_token',
          'Paste into the Value field in the top-right Authorize button and click Authorize'
        ],
        ko: [
          'Swagger 문서 진입',
          '/api/v1/auth/login에서 로그인 시도',
          'access_token 복사',
          '우측상단에 Authorize의 Value에 붙여넣기 후 Authorize 클릭'
        ]
      },
      note: {
        en: 'Use the access_token value from the login response',
        ko: 'login 응답의 access_token 값을 사용하세요'
      }
    }
  }
];

// Helper function to check if notice is within 7 days
export const isNewNotice = (dateStr: string): boolean => {
  const noticeDate = new Date(dateStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - noticeDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};