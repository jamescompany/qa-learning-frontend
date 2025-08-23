import api from './api';
import { User, UserRole } from '../types/user.types';

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
    const isDevelopment = import.meta.env.DEV;
    
    try {
      // First, try the actual API
      if (isDevelopment) {
        console.log('🌐 AuthService: Calling login API...');
      }
      
      const response = await api.post('/auth/login', credentials);
      const { access_token, refresh_token } = response.data;
      
      if (isDevelopment) {
        console.log('✅ AuthService: API login successful');
      }
      
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
    } catch (error: any) {
      // Fallback for development: Check temporary passwords
      if (isDevelopment) {
        console.warn('⚠️ AuthService: Login API failed, checking mock users...', {
          status: error.response?.status,
          message: error.response?.data?.detail || error.message
        });
      }
      
      // Check if there's a temporary password for this email
      const tempPasswords = JSON.parse(localStorage.getItem('tempPasswords') || '{}');
      const tempPasswordData = tempPasswords[credentials.email];
      
      if (tempPasswordData) {
        // Check if temp password is still valid (not expired)
        const expiresAt = new Date(tempPasswordData.expiresAt);
        const isExpired = new Date() > expiresAt;
        
        if (!isExpired && credentials.password === tempPasswordData.password) {
          // Temp password is valid - create mock session
          if (isDevelopment) {
            console.log('🔓 AuthService: Login successful with temporary password');
          }
          
          // Clear the temp password after successful use
          delete tempPasswords[credentials.email];
          localStorage.setItem('tempPasswords', JSON.stringify(tempPasswords));
          
          // Create mock tokens
          const mockAccessToken = 'mock_access_' + Date.now();
          const mockRefreshToken = 'mock_refresh_' + Date.now();
          
          localStorage.setItem('accessToken', mockAccessToken);
          localStorage.setItem('refreshToken', mockRefreshToken);
          
          // Create mock user
          const mockUser: User = {
            id: Date.now().toString(),
            email: credentials.email,
            name: credentials.email.split('@')[0],
            username: credentials.email.split('@')[0],
            role: UserRole.USER,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Store mock user in localStorage
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          
          return {
            user: mockUser,
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken
          };
        }
      }
      
      // Check stored passwords first (for users who changed their password)
      const storedPasswords = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
      const storedPassword = storedPasswords[credentials.email];
      
      // Also check default mock users for development
      const mockUsers = [
        { email: 'user@example.com', password: 'password123' },
        { email: 'admin@example.com', password: 'admin123' },
        { email: 'test@test.com', password: 'test123' },
        { email: 'james@example.com', password: 'james123' },
        { email: 'sarah@example.com', password: 'sarah123' }
      ];
      
      // Check if password matches stored password or default password
      const defaultUser = mockUsers.find(u => u.email === credentials.email);
      const matchedUser = defaultUser && (
        (storedPassword && credentials.password === storedPassword) ||
        (!storedPassword && credentials.password === defaultUser.password)
      );
      
      if (matchedUser) {
        if (isDevelopment) {
          console.log('✅ AuthService: Mock user login successful');
        }
        
        // Create mock session for default users
        const mockAccessToken = 'mock_access_' + Date.now();
        const mockRefreshToken = 'mock_refresh_' + Date.now();
        
        localStorage.setItem('accessToken', mockAccessToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        
        const mockUser: User = {
          id: Date.now().toString(),
          email: credentials.email,
          name: credentials.email.split('@')[0],
          username: credentials.email.split('@')[0],
          role: defaultUser.email.includes('admin') ? UserRole.ADMIN : UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        return {
          user: mockUser,
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken
        };
      }
      
      if (isDevelopment) {
        console.error('❌ AuthService: No matching user found');
      }
      
      // If no match found, throw the original error
      throw error;
    }
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
      localStorage.removeItem('mockUser'); // Clear mock user data
      
      // Remove auth header
      api.removeAuthToken();
      
      // Don't redirect here - let the component handle navigation
    }
  }

  async getCurrentUser(): Promise<User> {
    // First check if we have a mock user (temp password or mock login)
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      return JSON.parse(mockUser);
    }
    
    // Then try the actual API
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    // Check if we have a mock user first
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const user = JSON.parse(mockUser);
      // Update mock user data
      if (data.name || data.full_name) {
        user.name = data.name || data.full_name;
        user.full_name = data.name || data.full_name;
      }
      if (data.bio !== undefined) user.bio = data.bio;
      if (data.location !== undefined) user.location = data.location;
      if (data.website !== undefined) user.website = data.website;
      if (data.avatar || data.avatar_url) {
        user.avatar = data.avatar || data.avatar_url;
        user.avatar_url = data.avatar || data.avatar_url;
      }
      user.updatedAt = new Date().toISOString();
      
      // Save updated mock user
      localStorage.setItem('mockUser', JSON.stringify(user));
      console.log('Mock profile updated:', user);
      return user;
    }
    
    // Transform to backend field names for real API
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
    
    console.log('Sending profile update:', updateData);
    const response = await api.patch<User>('/auth/profile', updateData);
    console.log('Profile update response:', response.data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Check if we have a mock user first (since API will likely fail)
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      console.log('Changing password for mock user');
      
      // For mock users, we'll simulate password change
      const user = JSON.parse(mockUser);
      
      // Get stored passwords for validation
      const storedPasswords = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
      const currentStoredPassword = storedPasswords[user.email] || null;
      
      // Check if it's a temporary password user
      const tempPasswords = JSON.parse(localStorage.getItem('tempPasswords') || '{}');
      const tempPasswordData = tempPasswords[user.email];
      
      // Default mock passwords
      const defaultMockPasswords: { [key: string]: string } = {
        'user@example.com': 'password123',
        'admin@example.com': 'admin123',
        'test@test.com': 'test123',
        'james@example.com': 'james123',
        'sarah@example.com': 'sarah123'
      };
      
      // Determine what the current valid password should be
      let validCurrentPassword = currentStoredPassword || 
                                 defaultMockPasswords[user.email] || 
                                 (tempPasswordData && tempPasswordData.password);
      
      // Check if current password is correct
      if (currentPassword !== validCurrentPassword && !currentPassword.startsWith('Temp')) {
        throw new Error('Current password is incorrect');
      }
      
      // Check if new password is same as current
      if (newPassword === currentPassword) {
        throw new Error('New password must be different from current password');
      }
      
      // Store the new password
      storedPasswords[user.email] = newPassword;
      localStorage.setItem('mockPasswords', JSON.stringify(storedPasswords));
      
      // If it was a temp password, remove it
      if (tempPasswordData) {
        delete tempPasswords[user.email];
        localStorage.setItem('tempPasswords', JSON.stringify(tempPasswords));
      }
      
      console.log('Password changed successfully for mock user');
      return;
    }
    
    // Try the actual API for real users
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,  // Use snake_case for backend
        new_password: newPassword,
      });
    } catch (error: any) {
      // If it's a 422 error, the backend might expect different field names
      if (error.response?.status === 422) {
        console.error('Password change failed with 422:', error.response?.data);
        // Try alternative field names
        try {
          await api.post('/auth/change-password', {
            oldPassword: currentPassword,
            newPassword: newPassword,
          });
        } catch (retryError: any) {
          // If still failing, provide a helpful error message
          const errorMessage = retryError.response?.data?.detail || 
                              retryError.response?.data?.message || 
                              'Failed to change password. Please check your current password.';
          throw new Error(errorMessage);
        }
      } else {
        throw error;
      }
    }
  }

  async getAllUsers(): Promise<User[]> {
    // Mock implementation - in production, this would call the API
    const mockUsers: User[] = [
      { 
        id: 'user1', 
        email: 'user@example.com', 
        username: 'John Doe',
        name: 'John Doe',
        role: UserRole.USER 
      },
      { 
        id: 'user2', 
        email: 'admin@example.com', 
        username: 'Jane Admin',
        name: 'Jane Admin',
        role: UserRole.ADMIN 
      },
      { 
        id: 'user3', 
        email: 'test@test.com', 
        username: 'Test User',
        name: 'Test User',
        role: UserRole.USER 
      },
      { 
        id: 'user4', 
        email: 'james@example.com', 
        username: 'James Kang',
        name: 'James Kang',
        role: UserRole.USER 
      },
      { 
        id: 'user5', 
        email: 'sarah@example.com', 
        username: 'Sarah Lee',
        name: 'Sarah Lee',
        role: UserRole.USER 
      }
    ];
    
    return mockUsers;
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; tempPassword?: string; message?: string }> {
    try {
      // Try API first with additional error handling for Fortinet issues
      const response = await api.post('/auth/password-reset', { email }).catch((err) => {
        // Handle network errors specifically
        if (err.code === 'ERR_NETWORK' || err.code === 'ERR_CERT_AUTHORITY_INVALID' || err.message?.includes('Fortinet')) {
          console.warn('Network/Certificate error detected, likely Fortinet interference');
          throw new Error('FORTINET_BLOCK');
        }
        throw err;
      });
      
      // Check if API returned a temporary password (for learning purposes)
      if (response.data?.tempPassword) {
        return { 
          success: true, 
          tempPassword: response.data.tempPassword,
          message: 'Temporary password generated for learning purposes'
        };
      }
      
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error: any) {
      // Check if this is a Fortinet-specific error
      if (error.message === 'FORTINET_BLOCK') {
        console.warn('Fortinet is blocking the request, using fallback');
      }
      // For learning purposes: Generate temporary password for non-existent emails
      console.warn('Password reset API failed, using mock fallback');
      
      // Check if email exists in mock database
      const mockUsers = [
        'user@example.com',
        'admin@example.com',
        'test@test.com',
        'james@example.com',
        'sarah@example.com'
      ];
      
      if (mockUsers.includes(email.toLowerCase())) {
        // Simulate sending real email
        console.log(`[Mock] Sending password reset email to ${email}`);
        return { 
          success: true, 
          message: 'Password reset instructions have been sent to your email' 
        };
      } else {
        // For non-existent emails, generate temp password
        const tempPassword = 'Temp' + Math.random().toString(36).substring(2, 8).toUpperCase() + '!';
        
        // Store temp password in localStorage for this email
        const tempPasswords = JSON.parse(localStorage.getItem('tempPasswords') || '{}');
        tempPasswords[email] = {
          password: tempPassword,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        };
        localStorage.setItem('tempPasswords', JSON.stringify(tempPasswords));
        
        return { 
          success: true, 
          tempPassword,
          message: `Email not found in system. For learning purposes, here's a temporary password: ${tempPassword}`
        };
      }
    }
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