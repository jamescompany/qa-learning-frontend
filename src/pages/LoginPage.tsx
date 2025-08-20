import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginForm from '../components/forms/LoginForm';
import { useAuthStore } from '../store/authStore';
import AuthLayout from '../components/layout/AuthLayout';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (email: string, password: string) => {
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      console.log('🔐 Login attempt:', { email, password: '***' });
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (isDevelopment) {
        console.error('❌ Login failed:', err);
        console.log('Response data:', err.response?.data);
        console.log('Response status:', err.response?.status);
      }
      
      // For 401 or 422 errors from login attempts, show custom message
      if (err.response?.status === 401 || err.response?.status === 422) {
        const errorMessage = 'Invalid email or password. Please try again.';
        
        if (isDevelopment && err.response?.data?.detail) {
          console.log('Backend error detail:', err.response.data.detail);
        }
        
        setError(errorMessage);
      } else {
        // For other errors, try to parse the error message
        let errorMessage = 'An error occurred. Please try again.';
        
        if (err.response?.data?.detail) {
          const detail = err.response.data.detail;
          
          if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (Array.isArray(detail) && detail.length > 0) {
            const firstError = detail[0];
            if (typeof firstError === 'string') {
              errorMessage = firstError;
            } else if (firstError?.msg) {
              errorMessage = firstError.msg;
            }
          }
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        if (isDevelopment) {
          console.log('Setting error message:', errorMessage);
        }
        
        setError(String(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('auth.login.title')}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md" data-testid="error-message">
            {error}
          </div>
        )}
        
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.login.noAccount')}{' '}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t('auth.login.signUp')}
            </Link>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t('auth.login.forgotPassword')}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;