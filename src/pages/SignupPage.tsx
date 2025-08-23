import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignupForm from '../components/forms/SignupForm';
import { useAuthStore } from '../store/authStore';
import AuthLayout from '../components/layout/AuthLayout';
import SignupConfirmationModal from '../components/common/SignupConfirmationModal';

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = (data: any) => {
    setPendingSignupData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmSignup = async () => {
    if (!pendingSignupData) return;
    
    setShowConfirmModal(false);
    setIsLoading(true);
    setError(null);
    
    try {
      await register(pendingSignupData);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = '';
      
      // Handle 422 validation errors (FastAPI format)
      if (err.response?.status === 422 && err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          // Extract error messages from validation errors
          errorMessage = detail.map((e: any) => e.msg || e.message || 'Validation error').join(', ');
        } else {
          errorMessage = detail;
        }
      } else {
        errorMessage = err.response?.data?.detail || err.message || t('auth.signup.errors.signupFailed');
      }
      
      // Translate specific error messages
      if (typeof errorMessage === 'string') {
        if (errorMessage === 'This email was previously used and cannot be reused') {
          errorMessage = t('auth.signup.errors.emailPreviouslyUsed');
        } else if (errorMessage === 'This username was previously used and cannot be reused') {
          errorMessage = t('auth.signup.errors.usernamePreviouslyUsed');
        } else if (err.response?.status === 409) {
          errorMessage = t('auth.signup.errors.emailAlreadyExists');
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setPendingSignupData(null);
    }
  };

  const handleCancelSignup = () => {
    setShowConfirmModal(false);
    setPendingSignupData(null);
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
      
      <SignupConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmSignup}
        onCancel={handleCancelSignup}
        userData={{
          email: pendingSignupData?.email || '',
          name: pendingSignupData?.name || '',
        }}
      />
    </AuthLayout>
  );
};

export default SignupPage;