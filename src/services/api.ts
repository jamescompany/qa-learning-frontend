import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Use environment variable for API URL
    const getBaseURL = () => {
      // Always prefer environment variable if available
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      
      // Fallback to localhost for local development
      return 'http://localhost:8000/api/v1';
    };
    
    this.axiosInstance = axios.create({
      baseURL: getBaseURL(),
      timeout: 30000, // Increased to 30 seconds for email operations
      headers: {
        'Content-Type': 'application/json',
      },
      // Bypass SSL verification issues with Fortinet
      httpsAgent: typeof window === 'undefined' ? undefined : false,
      proxy: false,
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Double-check HTTPS in production
        const isProduction = typeof window !== 'undefined' && 
                           window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1';
        
        if (isProduction) {
          // Force HTTPS for ALL URLs in production
          if (config.url) {
            // Handle absolute URLs
            if (config.url.includes('://')) {
              config.url = config.url.replace(/^http:\/\//i, 'https://');
            }
          }
          
          // Always ensure baseURL is HTTPS in production
          if (config.baseURL) {
            config.baseURL = config.baseURL.replace(/^http:\/\//i, 'https://');
          }
          
          // Build the full URL and force HTTPS
          const fullUrl = axios.getUri(config);
          if (fullUrl && fullUrl.startsWith('http://')) {
            // If the full URL is still HTTP, override everything
            config.baseURL = 'https://api.qalearningweb.com/api/v1';
          }
        }
        
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await this.post('/auth/refresh', { refreshToken });
            const { accessToken } = response.data;
            
            localStorage.setItem('accessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, only redirect if not on login page
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Don't redirect if we're already on the login page
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/forgot-password') {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  // File upload
  async uploadFile(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Set auth token
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remove auth token
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }
}

export default new ApiService();