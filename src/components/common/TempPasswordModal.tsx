import React from 'react';
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {t('auth.tempPassword.subtitle')}
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
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
              <div className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 px-3 py-2 rounded-md">
                {email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.tempPassword.passwordLabel')}
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 text-sm font-mono text-gray-900 dark:text-gray-100 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                  {tempPassword}
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{i18n.language === 'ko' ? '실제 환경에서는:' : 'In a real environment:'}</strong> {t('auth.tempPassword.realWorldNote')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
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