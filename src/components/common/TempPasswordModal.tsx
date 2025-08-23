import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface TempPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  tempPassword: string;
}

const TempPasswordModal: React.FC<TempPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  email, 
  tempPassword 
}) => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword)
      .then(() => {
        toast.success(i18n.language === 'ko' ? '임시 비밀번호가 클립보드에 복사되었습니다!' : 'Temporary password copied to clipboard!');
      })
      .catch(() => {
        toast.error(i18n.language === 'ko' ? '복사 실패. 수동으로 복사해주세요.' : 'Copy failed. Please copy manually.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('auth.tempPassword.title')}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                  {t('auth.tempPassword.subtitle')}
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-500">
                  <p>{t('auth.tempPassword.notRegistered')}</p>
                  <p>{t('auth.tempPassword.generated')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.tempPassword.emailLabel')}
              </label>
              <div className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                {email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.tempPassword.passwordLabel')}
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={tempPassword}
                    readOnly
                    className="w-full text-sm font-mono text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 pr-10 rounded-md border border-blue-200 dark:border-blue-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-2 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {t('auth.tempPassword.copy')}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('auth.tempPassword.expiry')}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <strong>{i18n.language === 'ko' ? '실제 환경에서는:' : 'In a real environment:'}</strong> {t('auth.tempPassword.realWorldNote')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t('auth.tempPassword.close')}
          </button>
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('auth.tempPassword.goToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TempPasswordModal;