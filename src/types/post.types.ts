export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  author: Author;
  tags: string[];
  categories: Category[];
  coverImage?: string;
  published: boolean;
  featured: boolean;
  likes: number;
  views: number;
  readTime: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface PostCreateData {
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  categories?: string[];
  coverImage?: string;
  published: boolean;
  featured?: boolean;
}

export interface PostUpdateData extends Partial<PostCreateData> {}

export interface PostFilters {
  search?: string;
  tags?: string[];
  categories?: string[];
  author?: string;
  published?: boolean;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: PostSortBy;
  order?: 'asc' | 'desc';
}

export enum PostSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PUBLISHED_AT = 'publishedAt',
  LIKES = 'likes',
  VIEWS = 'views',
  COMMENTS = 'comments',
  TITLE = 'title',
}

export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageReadTime: number;
  popularTags: TagStats[];
}

export interface TagStats {
  tag: string;
  count: number;
  percentage: number;
}

export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  INSIGHTFUL = 'insightful',
  FUNNY = 'funny',
  BOOKMARK = 'bookmark',
}

export interface PostDraft {
  id: string;
  title: string;
  content: string;
  tags: string[];
  autoSavedAt: string;
  wordCount: number;
}

export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author: Author;
  readTime: number;
  createdAt: string;
}