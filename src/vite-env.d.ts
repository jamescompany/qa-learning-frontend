/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  
  // Feature flags
  readonly VITE_ENABLE_DARK_MODE: string;
  readonly VITE_ENABLE_REALTIME_CHAT: string;
  readonly VITE_ENABLE_FILE_UPLOAD: string;
  readonly VITE_ENABLE_SOCIAL_LOGIN: string;
  readonly VITE_ENABLE_TWO_FACTOR_AUTH: string;
  readonly VITE_ENABLE_PUSH_NOTIFICATIONS: string;
  readonly VITE_ENABLE_EMAIL_VERIFICATION: string;
  readonly VITE_ENABLE_PAYMENT: string;
  
  // Authentication
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_AUTH_REFRESH_TOKEN_KEY: string;
  readonly VITE_SESSION_TIMEOUT: string;
  
  // File upload
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ALLOWED_FILE_TYPES: string;
  
  // Analytics
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  
  // Social login
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GITHUB_CLIENT_ID?: string;
  readonly VITE_FACEBOOK_APP_ID?: string;
  
  // Development
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_ENABLE_LOGGER: string;
  readonly VITE_LOG_LEVEL: string;
  
  // Test
  readonly VITE_TEST_USER_EMAIL?: string;
  readonly VITE_TEST_USER_PASSWORD?: string;
  readonly VITE_TEST_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

// Module declarations
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.md' {
  const content: string;
  export default content;
}

export {};