import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignupForm from '../components/forms/SignupForm';
import { useAuthStore } from '../store/authStore';
import AuthLayout from '../components/layout/AuthLayout';

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await register(data);
      navigate('/dashboard');
    } catch (err: any) {
      // Check for 409 conflict (duplicate user)
      if (err.response?.status === 409) {
        setError('An account with this email already exists. Please use a different email or sign in.');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('auth.signup.title')}
        </h2>
        
        {/* Security Notice */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">{t('auth.signup.securityNotice.icon')}</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-amber-800">
                {t('auth.signup.securityNotice.title')}
              </h3>
              <div className="mt-2 text-sm text-amber-700 space-y-1">
                <p>{t('auth.signup.securityNotice.message')}</p>
                <p>{t('auth.signup.securityNotice.warning')}</p>
                <p className="font-semibold">{t('auth.signup.securityNotice.recommendation')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
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