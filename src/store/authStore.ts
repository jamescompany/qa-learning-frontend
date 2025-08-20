import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authService from '../services/auth.service';
import { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,

        login: async (email: string, password: string) => {
          const isDevelopment = import.meta.env.DEV;
          
          if (isDevelopment) {
            console.log('🔑 AuthStore: Login attempt for', email);
          }
          
          set({ isLoading: true, error: null });
          try {
            const response = await authService.login({ email, password });
            
            if (isDevelopment) {
              console.log('✅ AuthStore: Login successful', response.user);
            }
            
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            if (isDevelopment) {
              console.error('❌ AuthStore: Login failed', error);
            }
            
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error.response?.data?.message || 'Login failed',
            });
            throw error;
          }
        },

        signup: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.signup(data);
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 
                                error.response?.data?.message || 
                                (error.response?.status === 409 ? 'This email is already registered' : 'Signup failed');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        register: async (data) => {
          // Alias for signup
          return get().signup(data);
        },

        logout: () => {
          // Clear state immediately
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          // Clear ALL auth-related data from localStorage
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('mockUser');
          
          // Clear storage and auth synchronously
          authService.logout().catch(console.error);
          
          // Navigate to home page without reload - let React Router handle it
          // The component using logout should handle navigation
        },

        updateProfile: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const updatedUser = await authService.updateProfile(data);
            set({
              user: updatedUser,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Update failed',
            });
            throw error;
          }
        },

        checkAuth: async () => {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              // Keep existing error if any
            });
            return;
          }

          set({ isLoading: true });
          try {
            const user = await authService.getCurrentUser();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            // Only clear tokens if it's not a mock session
            const mockUser = localStorage.getItem('mockUser');
            if (!mockUser) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              // Don't clear error here - keep login error visible
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        version: 1,
      }
    )
  )
);