# QA Learning 101 - Frontend

React + TypeScript 기반의 QA 학습 애플리케이션 프론트엔드입니다.

## 🚀 기능

### 핵심 기능
- 📚 **학습 콘텐츠 관리**: 게시글 작성, 수정, 삭제, 검색
- ✅ **Todo 관리**: 할일 목록 관리 및 우선순위 설정
- 💬 **실시간 채팅**: WebSocket 기반 실시간 소통
- 📁 **파일 관리**: 파일 업로드 및 다운로드
- 👥 **사용자 인증**: JWT 기반 로그인/회원가입

### UI/UX
- 🌓 다크 모드 지원
- 📱 반응형 디자인
- ♿ 접근성 고려
- 🎨 Tailwind CSS 스타일링
- ⚡ 빠른 페이지 로딩

## 🛠 기술 스택

### Core
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router v6** - 라우팅

### 상태 관리
- **Zustand** - 전역 상태 관리
- **React Query** - 서버 상태 관리

### 스타일링
- **Tailwind CSS** - 유틸리티 CSS 프레임워크
- **PostCSS** - CSS 처리

### 개발 도구
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포매팅
- **Vitest** - 단위 테스트
- **Playwright** - E2E 테스트

## 📦 설치 및 실행

### 필수 조건
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/jamescompany/qa-learning-frontend.git
cd qa-learning-frontend

# 의존성 설치
npm install
# 또는
yarn install
```

### 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 값을 설정합니다:

```bash
cp .env.example .env.local
```

주요 환경 변수:
- `VITE_API_URL`: 백엔드 API 주소
- `VITE_WS_URL`: WebSocket 서버 주소

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

http://localhost:5173 에서 확인할 수 있습니다.

### 빌드

```bash
npm run build
# 또는
yarn build
```

### 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:coverage
```

## 📁 프로젝트 구조

```
frontend/
├── public/              # 정적 파일
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── common/      # 공통 컴포넌트
│   │   ├── forms/       # 폼 컴포넌트
│   │   └── layout/      # 레이아웃 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   ├── services/        # API 서비스
│   ├── store/           # 상태 관리
│   ├── types/           # TypeScript 타입 정의
│   ├── utils/           # 유틸리티 함수
│   ├── styles/          # 전역 스타일
│   └── main.tsx         # 애플리케이션 진입점
├── tests/               # 테스트 파일
├── .env.example         # 환경 변수 예제
├── vite.config.ts       # Vite 설정
├── tailwind.config.js   # Tailwind CSS 설정
└── tsconfig.json        # TypeScript 설정
```

## 🎯 주요 페이지

- **홈** (`/`): 랜딩 페이지
- **로그인** (`/login`): 사용자 인증
- **회원가입** (`/signup`): 계정 생성
- **대시보드** (`/dashboard`): 사용자 대시보드
- **게시글** (`/posts`): 게시글 목록 및 상세
- **Todo** (`/todos`): 할일 관리
- **프로필** (`/profile`): 사용자 프로필
- **설정** (`/settings`): 애플리케이션 설정

## 🔧 스크립트

```json
{
  "dev": "개발 서버 실행",
  "build": "프로덕션 빌드",
  "preview": "빌드 결과 미리보기",
  "lint": "ESLint 실행",
  "format": "Prettier 포매팅",
  "test": "단위 테스트 실행",
  "test:e2e": "E2E 테스트 실행",
  "test:coverage": "테스트 커버리지 확인"
}
```

## 🚀 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 배포

### 환경 변수 설정 (Vercel)

Vercel 대시보드에서 다음 환경 변수를 설정합니다:

- `VITE_API_URL`: 프로덕션 API 주소
- `VITE_WS_URL`: 프로덕션 WebSocket 주소
- 기타 필요한 환경 변수

## 🧪 테스팅

### 단위 테스트
- Vitest를 사용한 컴포넌트 및 유틸리티 테스트
- React Testing Library를 사용한 컴포넌트 테스트

### E2E 테스트
- Playwright를 사용한 전체 사용자 플로우 테스트
- 주요 시나리오: 로그인, 게시글 CRUD, Todo 관리

## 📝 코드 스타일

- **ESLint**: 코드 품질 관리
- **Prettier**: 일관된 코드 포매팅
- **TypeScript**: 타입 안정성

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 📞 문의

- GitHub: [@jamescompany](https://github.com/jamescompany)
- 프로젝트 링크: [https://github.com/jamescompany/qa-learning-frontend](https://github.com/jamescompany/qa-learning-frontend)

## 🙏 감사의 말

- React 팀
- Vite 팀
- Tailwind CSS 팀
- 모든 오픈소스 기여자들