import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import postService from '../services/post.service';
import { Post } from '../types/post.types';

interface PostFilters {
  search?: string;
  tags?: string[];
  author?: string;
  published?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'likes';
  order?: 'asc' | 'desc';
}

interface PostState {
  // Data
  posts: Post[];
  currentPost: Post | null;
  totalPosts: number;
  currentPage: number;
  pageSize: number;
  
  // UI State
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Filters
  filters: PostFilters;
  
  // Actions
  fetchPosts: (page?: number) => Promise<void>;
  fetchPost: (id: string) => Promise<void>;
  createPost: (data: any) => Promise<Post>;
  updatePost: (id: string, data: any) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  unlikePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  
  // Filter actions
  setFilters: (filters: PostFilters) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSortBy: (sortBy: PostFilters['sortBy']) => void;
  
  // UI actions
  clearError: () => void;
  setCurrentPost: (post: Post | null) => void;
  setPageSize: (size: number) => void;
}

export const usePostStore = create<PostState>()(
  devtools(
    (set, get) => ({
      // Initial state
      posts: [],
      currentPost: null,
      totalPosts: 0,
      currentPage: 1,
      pageSize: 10,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      filters: {},

      // Fetch posts
      fetchPosts: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
          const { filters, pageSize } = get();
          
          const response = await postService.getPosts({
            ...filters,
            page,
            limit: pageSize,
          });
          
          set({
            posts: response.posts,
            totalPosts: response.total,
            currentPage: page,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Failed to fetch posts:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch posts',
          });
        }
      },

      // Fetch single post
      fetchPost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const post = await postService.getPost(id);
          set({
            currentPost: post,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch post',
          });
        }
      },

      // Create post
      createPost: async (data) => {
        set({ isCreating: true, error: null });
        try {
          const newPost = await postService.createPost(data);
          
          set((state) => ({
            posts: [newPost, ...state.posts],
            totalPosts: state.totalPosts + 1,
            isCreating: false,
          }));
          
          return newPost;
        } catch (error: any) {
          console.error('Failed to create post:', error);
          set({
            isCreating: false,
            error: error.message || 'Failed to create post',
          });
          throw error;
        }
      },

      // Update post
      updatePost: async (id, data) => {
        set({ isUpdating: true, error: null });
        try {
          const updatedPost = await postService.updatePost(id, data);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === id ? updatedPost : state.currentPost,
            isUpdating: false,
          }));
        } catch (error: any) {
          set({
            isUpdating: false,
            error: error.response?.data?.message || 'Failed to update post',
          });
          throw error;
        }
      },

      // Delete post
      deletePost: async (id) => {
        set({ isDeleting: true, error: null });
        try {
          await postService.deletePost(id);
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
            totalPosts: state.totalPosts - 1,
            currentPost: state.currentPost?.id === id ? null : state.currentPost,
            isDeleting: false,
          }));
        } catch (error: any) {
          set({
            isDeleting: false,
            error: error.response?.data?.message || 'Failed to delete post',
          });
          throw error;
        }
      },

      // Like post
      likePost: async (id) => {
        try {
          // Call backend API
          const updatedPost = await postService.likePost(id);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === id ? updatedPost : state.currentPost,
          }));
        } catch (error: any) {
          // If already liked, treat as success
          if (error.response?.status === 400 && error.response?.data?.detail === "Already liked this post") {
            return;
          }
          set({
            error: error.response?.data?.message || 'Failed to like post',
          });
          throw error;
        }
      },

      // Unlike post
      unlikePost: async (id) => {
        try {
          // Call backend API
          const updatedPost = await postService.unlikePost(id);
          
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === id ? updatedPost : state.currentPost,
          }));
        } catch (error: any) {
          // If not liked, treat as success
          if (error.response?.status === 400 && error.response?.data?.detail === "Post not liked") {
            return;
          }
          set({
            error: error.response?.data?.message || 'Failed to unlike post',
          });
          throw error;
        }
      },

      // Add comment
      addComment: async (postId, content) => {
        try {
          const newComment = await postService.addComment(postId, content);
          // After adding comment, fetch the updated post
          const updatedPost = await postService.getPost(postId);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === postId ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === postId ? updatedPost : state.currentPost,
          }));
          return newComment;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to add comment',
          });
          throw error;
        }
      },

      // Delete comment
      deleteComment: async (postId, commentId) => {
        try {
          await postService.deleteComment(commentId);
          // After deleting comment, fetch the updated post
          const updatedPost = await postService.getPost(postId);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === postId ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === postId ? updatedPost : state.currentPost,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to delete comment',
          });
          throw error;
        }
      },

      // Filter actions
      setFilters: (filters) => {
        set({ filters });
        get().fetchPosts(1);
      },

      clearFilters: () => {
        set({ filters: {} });
        get().fetchPosts(1);
      },

      setSearchQuery: (query) => {
        set((state) => ({
          filters: { ...state.filters, search: query },
        }));
        get().fetchPosts(1);
      },

      setSelectedTags: (tags) => {
        set((state) => ({
          filters: { ...state.filters, tags },
        }));
        get().fetchPosts(1);
      },

      setSortBy: (sortBy) => {
        set((state) => ({
          filters: { ...state.filters, sortBy },
        }));
        get().fetchPosts(1);
      },

      // UI actions
      clearError: () => set({ error: null }),
      setCurrentPost: (post) => set({ currentPost: post }),
      setPageSize: (size) => {
        set({ pageSize: size });
        get().fetchPosts(1);
      },
    }),
    {
      name: 'post-store',
    }
  )
);