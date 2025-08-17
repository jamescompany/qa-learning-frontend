// Re-export all types for convenient importing
export * from './user.types';
export * from './post.types';
export * from './todo.types';

// Common types used across the application
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  url?: string;
}

export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: ValidationRule;
  defaultValue?: any;
}

export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  TIME = 'time',
  FILE = 'file',
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  action?: () => void;
  children?: MenuItem[];
  badge?: string | number;
  disabled?: boolean;
  divider?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
  active?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  closable?: boolean;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}