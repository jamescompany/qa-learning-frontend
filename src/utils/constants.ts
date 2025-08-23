import { API_CONFIG } from '../config/api.config';

// API Configuration - Use getters for dynamic evaluation
export const getApiBaseUrl = () => API_CONFIG.API_URL;
export const getWsBaseUrl = () => API_CONFIG.WS_URL;

// For backwards compatibility (deprecated - will be removed)
export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();

export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second
export const WS_RECONNECT_INTERVAL = 5000;
export const WS_MAX_RECONNECT_ATTEMPTS = 5;
export const WS_PING_INTERVAL = 30000;

// Authentication
export const TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_KEY = 'user';
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
export const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for large files

// Form Validation
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 20;
export const MAX_BIO_LENGTH = 500;
export const MAX_POST_TITLE_LENGTH = 200;
export const MAX_POST_CONTENT_LENGTH = 50000;
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_TODO_TITLE_LENGTH = 100;
export const MAX_TODO_DESCRIPTION_LENGTH = 500;

// UI Constants
export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;
export const THROTTLE_DELAY = 1000;
export const ANIMATION_DURATION = 300;
export const MODAL_Z_INDEX = 1000;
export const TOOLTIP_Z_INDEX = 1100;
export const DRAWER_Z_INDEX = 900;
export const OVERLAY_Z_INDEX = 800;

// Date/Time
export const DATE_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const DEFAULT_TIMEZONE = 'UTC';
export const BUSINESS_HOURS_START = 9; // 9 AM
export const BUSINESS_HOURS_END = 17; // 5 PM

// Colors (matches Tailwind)
export const COLORS = {
  primary: '#3B82F6', // blue-500
  secondary: '#8B5CF6', // violet-500
  success: '#10B981', // emerald-500
  warning: '#F59E0B', // amber-500
  error: '#EF4444', // red-500
  info: '#06B6D4', // cyan-500
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Breakpoints (matches Tailwind)
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: { value: 1, label: 'Low', color: 'green' },
  MEDIUM: { value: 2, label: 'Medium', color: 'yellow' },
  HIGH: { value: 3, label: 'High', color: 'orange' },
  URGENT: { value: 4, label: 'Urgent', color: 'red' },
};

// Status Types
export const TODO_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest',
};

// Permissions
export const PERMISSIONS = {
  // Posts
  CREATE_POST: 'create:post',
  EDIT_POST: 'edit:post',
  DELETE_POST: 'delete:post',
  PUBLISH_POST: 'publish:post',
  
  // Comments
  CREATE_COMMENT: 'create:comment',
  EDIT_COMMENT: 'edit:comment',
  DELETE_COMMENT: 'delete:comment',
  MODERATE_COMMENT: 'moderate:comment',
  
  // Users
  MANAGE_USERS: 'manage:users',
  BAN_USER: 'ban:user',
  EDIT_USER: 'edit:user',
  
  // Admin
  ACCESS_ADMIN: 'access:admin',
  MANAGE_SETTINGS: 'manage:settings',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  RATE_LIMIT: 'Too many requests. Please slow down.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  COPIED: 'Copied to clipboard.',
  SENT: 'Sent successfully.',
  UPLOADED: 'Uploaded successfully.',
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Social Media
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com',
  GITHUB: 'https://github.com',
  LINKEDIN: 'https://linkedin.com/in',
  FACEBOOK: 'https://facebook.com',
  INSTAGRAM: 'https://instagram.com',
};

// External Services
export const EXTERNAL_SERVICES = {
  GRAVATAR: 'https://www.gravatar.com/avatar',
  UNSPLASH: 'https://source.unsplash.com',
  PLACEHOLDER: 'https://via.placeholder.com',
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  REALTIME_CHAT: true,
  FILE_UPLOAD: true,
  SOCIAL_LOGIN: false,
  TWO_FACTOR_AUTH: false,
  PUSH_NOTIFICATIONS: false,
  EMAIL_VERIFICATION: true,
  PAYMENT_INTEGRATION: false,
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  SEARCH: 'search',
  SHARE: 'share',
  LOGIN: 'login',
  SIGNUP: 'signup',
  LOGOUT: 'logout',
  ERROR: 'error',
};