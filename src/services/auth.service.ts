import api from './api';
import { User } from '../types/user.types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    
    // Store tokens
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    
    // Set auth header
    api.setAuthToken(access_token);
    
    // Get user data
    const userResponse = await api.get('/auth/me');
    
    return {
      user: userResponse.data,
      accessToken: access_token,
      refreshToken: refresh_token
    };
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    // Transform frontend data to backend format
    const registerData = {
      email: data.email,
      username: data.email.split('@')[0], // Generate username from email
      password: data.password,
      full_name: data.name
    };
    const response = await api.post('/auth/register', registerData);
    
    // Registration returns user data directly, need to login to get tokens
    const loginResponse = await this.login({
      email: data.email,
      password: data.password
    });
    
    return loginResponse;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Remove auth header
      api.removeAuthToken();
      
      // Redirect to landing page
      window.location.href = '/';
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    // Transform to backend field names
    const updateData: any = {};
    if (data.name || data.full_name) {
      updateData.full_name = data.name || data.full_name;
    }
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.avatar || data.avatar_url) {
      updateData.avatar_url = data.avatar || data.avatar_url;
    }
    
    const response = await api.patch<User>('/auth/profile', updateData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/password-reset/request', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/password-reset/confirm', {
      token,
      newPassword,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<void> {
    await api.post('/auth/resend-verification');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export default new AuthService();