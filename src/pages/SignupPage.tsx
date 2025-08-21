import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignupForm from '../components/forms/SignupForm';
import { useAuthStore } from '../store/authStore';
import AuthLayout from '../components/layout/AuthLayout';

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await register(data);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = err.response?.data?.detail || err.message || t('auth.signup.errors.signupFailed');
      
      // Translate specific error messages
      if (errorMessage === 'This email was previously used and cannot be reused') {
        errorMessage = t('auth.signup.errors.emailPreviouslyUsed');
      } else if (errorMessage === 'This username was previously used and cannot be reused') {
        errorMessage = t('auth.signup.errors.usernamePreviouslyUsed');
      } else if (err.response?.status === 409) {
        errorMessage = t('auth.signup.errors.emailAlreadyExists');
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t('auth.signup.title')}
        </h2>
        
        {/* Security Notice */}
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">{t('auth.signup.securityNotice.icon')}</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                {t('auth.signup.securityNotice.title')}
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-500 space-y-1">
                <p>{t('auth.signup.securityNotice.message')}</p>
                <p>{t('auth.signup.securityNotice.warning')}</p>
                <p className="font-semibold">{t('auth.signup.securityNotice.recommendation')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        
        <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.signup.hasAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t('auth.signup.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;