import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DeleteAccountModal from '../components/common/DeleteAccountModal';
import Modal from '../components/common/Modal';
import api from '../services/api';
import { useTheme } from '../hooks/useTheme';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const initialSettings = {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    publicProfile: true,
    twoFactorAuth: false,
    theme: theme,
    language: i18n.language,
  };
  
  const [settings, setSettings] = useState(initialSettings);
  const [originalSettings, setOriginalSettings] = useState(initialSettings);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const loadedSettings = {
          ...parsed,
          theme: localStorage.getItem('theme') || theme,
          language: localStorage.getItem('language') || i18n.language,
        };
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Check for changes whenever settings update
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save settings to localStorage (for theme and language)
      localStorage.setItem('theme', settings.theme);
      localStorage.setItem('language', settings.language);
      
      // Apply theme immediately if changed
      if (settings.theme !== originalSettings.theme) {
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      // Apply language immediately if changed
      if (settings.language !== originalSettings.language) {
        await i18n.changeLanguage(settings.language);
      }
      
      // Save other settings to localStorage as well
      localStorage.setItem('userSettings', JSON.stringify({
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        weeklyReports: settings.weeklyReports,
        publicProfile: settings.publicProfile,
        twoFactorAuth: settings.twoFactorAuth,
      }));
      
      // If you have a backend API, uncomment and use this:
      // await api.put('/users/settings', settings);
      
      // Update original settings after successful save
      setOriginalSettings(settings);
      setHasChanges(false);
      
      // Show success message
      setSuccessMessage(t('settings.saveSuccess'));
      setShowSuccessModal(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      setErrorMessage(t('settings.saveError') || 'Failed to save settings');
      setShowErrorModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/users/me');
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Show success and redirect
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      setShowDeleteModal(false);
      setErrorMessage(error.response?.data?.detail || t('settings.account.deleteAccountError'));
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('settings.title')}</h1>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.tabs.notifications')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.notifications.title')}</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.notifications.emailNotifications')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.notifications.emailNotificationsDescription')}</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.notifications.pushNotifications')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.notifications.pushNotificationsDescription')}</p>
              </div>
              <button
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.notifications.notificationTypes.weeklyDigest')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.notifications.notificationTypes.weeklyDigestDescription')}</p>
              </div>
              <button
                onClick={() => handleToggle('weeklyReports')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weeklyReports ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                    settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.tabs.privacy')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.privacy.title')}</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.privacy.profileVisibility')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.privacy.profileVisibilityDescription')}</p>
              </div>
              <button
                onClick={() => handleToggle('publicProfile')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.publicProfile ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                    settings.publicProfile ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.account.twoFactorAuth')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.privacy.twoFactorAuthDescription')}</p>
              </div>
              <button
                onClick={() => handleToggle('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.tabs.general')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.general.title')}</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.general.theme')}
              </label>
              <select
                value={settings.theme}
                onChange={(e) => {
                  const newTheme = e.target.value as 'light' | 'dark';
                  setSettings(prev => ({ ...prev, theme: newTheme }));
                  // Apply theme immediately
                  if (newTheme !== theme) {
                    if (newTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                    localStorage.setItem('theme', newTheme);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">{t('settings.general.themeOptions.light')}</option>
                <option value="dark">{t('settings.general.themeOptions.dark')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.general.language')}
              </label>
              <select
                value={i18n.language}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                  setSettings(prev => ({ ...prev, language: e.target.value }));
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.tabs.account')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.account.title')}</p>
          </div>
          <div className="p-6">
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
                {t('settings.account.dangerZone')}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {t('settings.account.deleteAccountDescription')}
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
              >
                {t('settings.account.deleteAccount')}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`px-6 py-2 rounded-lg transition-colors font-medium ${
              hasChanges && !isSaving
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? t('status.saving') : t('settings.saveChanges')}
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('status.success')}
        message={successMessage || t('settings.account.deleteAccountSuccess')}
        type="success"
      />

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={t('status.error')}
        message={errorMessage}
        type="error"
      />
    </DashboardLayout>
  );
};

export default SettingsPage;