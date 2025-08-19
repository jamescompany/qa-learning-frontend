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
          
          // Always use local storage for now (since API is not available)
          console.log('Loading posts from local storage');
          
          // Load from local storage
          let storedPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
          
          // Validate stored posts have correct structure
          const validPosts = storedPosts.filter((post: any) => 
            post && post.id && post.title && post.content
          );
          
          // Add some default posts if none exist or invalid
          if (validPosts.length === 0) {
            const defaultPosts: Post[] = [
              {
                id: '1',
                title: 'Best Practices for API Testing',
                content: 'Learn the essential techniques for effective API testing. This comprehensive guide covers everything from request validation to response verification.',
                slug: 'best-practices-for-api-testing',
                author: { id: '1', name: 'James Kang' },
                tags: ['API', 'Testing', 'Automation'],
                categories: ['Tutorial'],
                published: true,
                featured: true,
                likes: 24,
                views: 156,
                readTime: 3,
                comments: [],
                createdAt: new Date('2024-01-15').toISOString(),
                updatedAt: new Date('2024-01-15').toISOString(),
              },
              {
                id: '2',
                title: 'Introduction to Selenium WebDriver',
                content: 'A comprehensive guide to getting started with Selenium WebDriver for web automation testing.',
                slug: 'introduction-to-selenium-webdriver',
                author: { id: '2', name: 'Sarah Kim' },
                tags: ['Selenium', 'Automation', 'Tutorial'],
                categories: ['Tutorial'],
                published: true,
                featured: false,
                likes: 18,
                views: 89,
                readTime: 2,
                comments: [],
                createdAt: new Date('2024-01-14').toISOString(),
                updatedAt: new Date('2024-01-14').toISOString(),
              },
              {
                id: '3',
                title: 'Understanding Test Automation Frameworks',
                content: 'Explore different test automation frameworks and choose the right one for your project. Compare popular frameworks like Cypress, Playwright, and WebDriverIO.',
                slug: 'understanding-test-automation-frameworks',
                author: { id: '1', name: 'James Kang' },
                tags: ['Frameworks', 'Testing', 'Comparison'],
                categories: ['Guide'],
                published: true,
                featured: true,
                likes: 31,
                views: 234,
                readTime: 4,
                comments: [],
                createdAt: new Date('2024-01-13').toISOString(),
                updatedAt: new Date('2024-01-13').toISOString(),
              },
            ];
            localStorage.setItem('localPosts', JSON.stringify(defaultPosts));
            storedPosts = defaultPosts;
          } else {
            storedPosts = validPosts;
          }
          
          // Apply filters if any
          let filteredPosts = [...storedPosts];
          
          if (filters.search) {
            filteredPosts = filteredPosts.filter(post => 
              post.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
              post.content.toLowerCase().includes(filters.search!.toLowerCase())
            );
          }
          
          if (filters.tags && filters.tags.length > 0) {
            filteredPosts = filteredPosts.filter(post =>
              filters.tags!.some(tag => post.tags.includes(tag))
            );
          }
          
          // Sort posts
          filteredPosts.sort((a, b) => {
            const dateA = new Date(b.createdAt).getTime();
            const dateB = new Date(a.createdAt).getTime();
            return dateA - dateB; // Newest first
          });
          
          set({
            posts: filteredPosts,
            totalPosts: filteredPosts.length,
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
          // Always use local storage for now
          console.log('Creating post in local storage');
          
          // Get current user from auth store or localStorage
          const mockUser = localStorage.getItem('mockUser');
          const authStorage = localStorage.getItem('auth-storage');
          let currentUser = null;
          
          if (mockUser) {
            currentUser = JSON.parse(mockUser);
          } else if (authStorage) {
            try {
              const authData = JSON.parse(authStorage);
              currentUser = authData.state?.user;
            } catch (e) {
              console.error('Failed to parse auth storage', e);
            }
          }
          
          // Determine user display name
          const userName = currentUser?.full_name || 
                          currentUser?.name || 
                          currentUser?.username || 
                          currentUser?.email?.split('@')[0] || 
                          'Anonymous';
          
          // Create a new post
          const newPost: Post = {
            id: Date.now().toString(),
            title: data.title,
            content: data.content,
            slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            tags: data.tags || [],
            categories: data.categories || [],
            published: data.published !== false, // Default to true
            featured: false,
            author: {
              id: currentUser?.id || Date.now().toString(),
              name: userName,
            },
            likes: 0,
            views: 0,
            readTime: Math.ceil(data.content.split(' ').length / 200), // Estimate reading time
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Save to local storage
          const storedPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
          storedPosts.unshift(newPost); // Add to beginning
          localStorage.setItem('localPosts', JSON.stringify(storedPosts));
          
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
          const updatedPost = await postService.likePost(id);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === id ? updatedPost : state.currentPost,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to like post',
          });
        }
      },

      // Unlike post
      unlikePost: async (id) => {
        try {
          const updatedPost = await postService.unlikePost(id);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === id ? updatedPost : state.currentPost,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to unlike post',
          });
        }
      },

      // Add comment
      addComment: async (postId, content) => {
        try {
          const updatedPost = await postService.addComment(postId, content);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === postId ? updatedPost : post
            ),
            currentPost: state.currentPost?.id === postId ? updatedPost : state.currentPost,
          }));
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
          const updatedPost = await postService.deleteComment(postId, commentId);
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