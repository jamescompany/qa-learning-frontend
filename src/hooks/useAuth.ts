import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import authService from '../services/auth.service';
import { User } from '../types/user.types';
import { toast } from '../store/uiStore';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    signup: storeSignup,
    logout: storeLogout,
    updateProfile: storeUpdateProfile,
    checkAuth: storeCheckAuth,
    clearError,
  } = useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      storeCheckAuth();
    }
  }, []);

  // Enhanced login with remember me
  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      await storeLogin(email, password);
      
      if (rememberMe) {
        // Store refresh token with extended expiry
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          localStorage.setItem('rememberMe', 'true');
        }
      }
      
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  }, [storeLogin, navigate]);

  // Enhanced signup with auto-login
  const signup = useCallback(async (data: SignupData) => {
    try {
      await storeSignup(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  }, [storeSignup, navigate]);

  // Enhanced logout with cleanup
  const logout = useCallback(async () => {
    try {
      await storeLogout();
      localStorage.removeItem('rememberMe');
      toast.info('You have been logged out');
      navigate('/login');
    } catch (error: any) {
      toast.error('Logout failed');
      throw error;
    }
  }, [storeLogout, navigate]);

  // Profile update
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      await storeUpdateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  }, [storeUpdateProfile]);

  // Password management
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
      throw error;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      await authService.requestPasswordReset(email);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      await authService.resetPassword(token, newPassword);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
      throw error;
    }
  }, [navigate]);

  // Email verification
  const verifyEmail = useCallback(async (token: string) => {
    try {
      await authService.verifyEmail(token);
      toast.success('Email verified successfully');
      await storeCheckAuth(); // Refresh user data
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify email');
      throw error;
    }
  }, [storeCheckAuth]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      await storeCheckAuth();
    } catch (error) {
      // Silent fail - user is not authenticated
    }
  }, [storeCheckAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    checkAuth,
    clearError,
  };
};

// Protected route hook
export const useRequireAuth = (redirectTo = '/login') => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};

// Role-based access hook
export const useRole = () => {
  const { user } = useAuthStore();
  
  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const isModerator = useCallback(() => {
    return user?.role === 'moderator';
  }, [user]);

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    userRole: user?.role || null,
  };
};

// Permission-based access hook
export const usePermission = () => {
  const { user } = useAuthStore();
  
  const hasPermission = useCallback((permission: string) => {
    // Implement permission checking logic based on user role
    // This is a simplified example
    const rolePermissions: Record<string, string[]> = {
      admin: ['all'],
      moderator: ['read', 'write', 'moderate'],
      user: ['read', 'write:own'],
      guest: ['read'],
    };

    if (!user) return false;
    
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes('all') || permissions.includes(permission);
  }, [user]);

  return { hasPermission };
};