import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({ 
  isOpen, 
  onClose, 
  userId 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !showDeleteConfirm) {
        // Don't allow closing with ESC for this modal
        event.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, showDeleteConfirm]);

  if (!isOpen) return null;

  const handleAcceptTerms = async () => {
    if (!termsAccepted || !privacyAccepted) {
      setErrorMessage(t('auth.termsAcceptance.pleaseAcceptBoth'));
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.post('/auth/accept-terms', { user_id: userId });
      
      // Store tokens
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      
      // Set auth header
      api.setAuthToken(response.data.access_token);
      
      // Refresh the page to complete login
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to accept terms:', error);
      const errorDetail = error.response?.data?.detail;
      // Handle both string and object error messages
      const errorMsg = typeof errorDetail === 'string' 
        ? errorDetail 
        : (errorDetail?.[0]?.msg || t('auth.termsAcceptance.acceptError'));
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Use custom confirm modal instead of browser confirm
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await api.delete(`/users/${userId}`);
      logout();
      navigate('/');
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      const errorDetail = error.response?.data?.detail;
      // Handle both string and object error messages
      const errorMsg = typeof errorDetail === 'string' 
        ? errorDetail 
        : (errorDetail?.[0]?.msg || t('auth.termsAcceptance.deleteError'));
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t('auth.termsAcceptance.title')}
        </h2>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('auth.termsAcceptance.message')}
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isLoading}
                className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <a 
                  href="/terms" 
                  target="_blank" 
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('auth.signup.termsOfService')}
                </a>
                {t('auth.signup.agreeToTerms')}
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                disabled={isLoading}
                className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <a 
                  href="/privacy" 
                  target="_blank" 
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('auth.signup.privacyPolicy')}
                </a>
                {t('auth.signup.agreeToPrivacy')}
              </span>
            </label>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <div className="flex justify-between">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
            >
              {t('auth.termsAcceptance.deleteAccount')}
            </button>
            <button
              onClick={handleAcceptTerms}
              disabled={!termsAccepted || !privacyAccepted || isLoading}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                termsAccepted && privacyAccepted
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? t('common.status.loading') : t('auth.termsAcceptance.accept')}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-sm text-red-700 dark:text-red-400">
                {t('auth.termsAcceptance.deleteConfirmMessage')}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {t('common.buttons.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? t('common.status.loading') : t('auth.termsAcceptance.confirmDelete')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsAcceptanceModal;