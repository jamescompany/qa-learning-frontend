import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  isLoading = false 
}) => {
  const { t } = useTranslation();
  const [confirmText, setConfirmText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmText(value);
    setIsConfirmed(value === 'DELETE');
  };

  const handleClose = () => {
    setConfirmText('');
    setIsConfirmed(false);
    onClose();
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="ml-4 text-xl font-semibold text-gray-900">
              {t('settings.account.deleteAccount')}
            </h3>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 mb-2">
              {t('settings.account.deleteAccountWarning')}
            </p>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              <li>{t('settings.account.deleteAccountConsequence1')}</li>
              <li>{t('settings.account.deleteAccountConsequence2')}</li>
              <li>{t('settings.account.deleteAccountConsequence3')}</li>
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.account.deleteAccountConfirmation')}
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={handleInputChange}
              placeholder={t('settings.account.deleteAccountPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t('settings.account.deleteAccountHint')}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('common.loading') : t('settings.account.deleteAccountButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;