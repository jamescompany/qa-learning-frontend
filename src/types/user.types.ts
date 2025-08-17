export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  publicProfile: boolean;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

export interface UserStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalTodos: number;
  completedTodos: number;
  streak: number;
  joinedDays: number;
  lastActiveAt: string;
}

export interface UserProfile extends User {
  followers: number;
  following: number;
  badges: Badge[];
  socialLinks?: SocialLinks;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface UserUpdateData {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export enum ActivityType {
  POST_CREATED = 'post_created',
  POST_LIKED = 'post_liked',
  COMMENT_ADDED = 'comment_added',
  TODO_COMPLETED = 'todo_completed',
  PROFILE_UPDATED = 'profile_updated',
  BADGE_EARNED = 'badge_earned',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  MENTION = 'mention',
  FOLLOW = 'follow',
}