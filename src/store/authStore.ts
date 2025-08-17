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
  logout: () => Promise<void>;
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
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.login({ email, password });
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
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
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error.response?.data?.message || 'Signup failed',
            });
            throw error;
          }
        },

        register: async (data) => {
          // Alias for signup
          return get().signup(data);
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await authService.logout();
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Logout failed',
            });
          }
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
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
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
      }
    )
  )
);