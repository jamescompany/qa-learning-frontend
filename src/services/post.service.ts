import api from './api';
import { Post } from '../types/post.types';

interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  published: boolean;
}

interface UpdatePostData extends Partial<CreatePostData> {}

interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

interface PostFilters {
  search?: string;
  tags?: string[];
  author?: string;
  published?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'likes';
  order?: 'asc' | 'desc';
}

class PostService {
  async getPosts(filters: PostFilters = {}): Promise<PostsResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters.author) params.append('author', filters.author);
    if (filters.published !== undefined) params.append('published', String(filters.published));
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);
    
    const response = await api.get<PostsResponse>(`/posts/?${params}`);
    return response.data;
  }

  async getPost(id: string): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post<Post>('/posts/', data);
    return response.data;
  }

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    const response = await api.put<Post>(`/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  }

  async likePost(id: string): Promise<Post> {
    const response = await api.post<Post>(`/posts/${id}/like`);
    return response.data;
  }

  async unlikePost(id: string): Promise<Post> {
    const response = await api.delete<Post>(`/posts/${id}/like`);
    return response.data;
  }

  async addComment(postId: string, content: string): Promise<any> {
    // Use the comments API endpoint directly
    const response = await api.post(`/comments`, { 
      post_id: postId,
      content: content 
    });
    return response.data;
  }

  async deleteComment(commentId: string): Promise<any> {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }

  async getMyPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>('/posts/my');
    return response.data;
  }

  async getPopularPosts(limit: number = 10): Promise<Post[]> {
    const response = await api.get<Post[]>(`/posts/popular?limit=${limit}`);
    return response.data;
  }

  async getRelatedPosts(postId: string, limit: number = 5): Promise<Post[]> {
    const response = await api.get<Post[]>(`/posts/${postId}/related?limit=${limit}`);
    return response.data;
  }

  async searchPosts(query: string): Promise<Post[]> {
    const response = await api.get<Post[]>(`/posts/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export default new PostService();