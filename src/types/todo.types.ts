export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  completed: boolean;
  dueDate?: string;
  completedAt?: string;
  tags: string[];
  assignee?: TodoAssignee;
  attachments: Attachment[];
  checklist: ChecklistItem[];
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export interface TodoAssignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

export interface TodoCreateData {
  title: string;
  description?: string;
  priority: TodoPriority;
  dueDate?: string;
  tags?: string[];
  assigneeId?: string;
  estimatedTime?: number;
}

export interface TodoUpdateData extends Partial<TodoCreateData> {
  status?: TodoStatus;
  completed?: boolean;
  actualTime?: number;
}

export interface TodoFilters {
  search?: string;
  status?: TodoStatus | 'all';
  priority?: TodoPriority;
  completed?: boolean;
  assignee?: string;
  tags?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  overdue?: boolean;
  sortBy?: TodoSortBy;
  order?: 'asc' | 'desc';
}

export enum TodoSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DUE_DATE = 'dueDate',
  PRIORITY = 'priority',
  TITLE = 'title',
  STATUS = 'status',
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  inProgress: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
  todaysDue: number;
  thisWeekDue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byStatus: {
    todo: number;
    in_progress: number;
    review: number;
    done: number;
    cancelled: number;
  };
}

export interface TodoTemplate {
  id: string;
  name: string;
  description: string;
  defaultTitle: string;
  defaultDescription?: string;
  defaultPriority: TodoPriority;
  defaultTags: string[];
  checklist: string[];
  icon: string;
}

export interface TodoRecurrence {
  id: string;
  todoId: string;
  pattern: RecurrencePattern;
  interval: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;
  endDate?: string;
  occurrences?: number;
  nextDue: string;
}

export enum RecurrencePattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface TodoReminder {
  id: string;
  todoId: string;
  time: string;
  type: ReminderType;
  sent: boolean;
  sentAt?: string;
}

export enum ReminderType {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app',
}

export interface TodoHistory {
  id: string;
  todoId: string;
  action: TodoAction;
  field?: string;
  oldValue?: any;
  newValue?: any;
  userId: string;
  userName: string;
  timestamp: string;
}

export enum TodoAction {
  CREATED = 'created',
  UPDATED = 'updated',
  COMPLETED = 'completed',
  REOPENED = 'reopened',
  DELETED = 'deleted',
  ASSIGNED = 'assigned',
  COMMENTED = 'commented',
}