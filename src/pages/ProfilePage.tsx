import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import FormInput from '../components/forms/FormInput';
import Modal from '../components/common/Modal';
import { useAuthStore } from '../store/authStore';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
  });
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.full_name || user.name || user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSave = async () => {
    try {
      // Call updateProfile from authStore
      const { updateProfile } = useAuthStore.getState();
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      });
      setIsEditing(false);
      // Show success modal
      setModalMessage({
        title: t('profile.success'),
        message: t('profile.profileUpdatedSuccess'),
        type: 'success'
      });
      setShowModal(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setModalMessage({
        title: t('profile.error'),
        message: t('profile.profileUpdateError'),
        type: 'error'
      });
      setShowModal(true);
    }
  };

  const validatePassword = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = t('profile.security.errors.currentPasswordRequired');
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = t('profile.security.errors.newPasswordRequired');
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = t('profile.security.errors.passwordMinLength');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = t('profile.security.errors.passwordRequirements');
      isValid = false;
    } else if (passwordData.currentPassword && passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = t('profile.security.errors.passwordMustBeDifferent');
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = t('profile.security.errors.confirmPasswordRequired');
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t('profile.security.errors.passwordsDoNotMatch');
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success(t('profile.security.passwordChanged'));
      
      // Clear form
      setShowPasswordSection(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Logout after password change
      setTimeout(() => {
        // Clear auth state and navigate
        useAuthStore.getState().logout();
      }, 1500); // Give user time to see the success message
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || t('profile.security.passwordChangeError');
      toast.error(errorMessage);
      if (errorMessage.toLowerCase().includes('current password')) {
        setPasswordErrors(prev => ({ ...prev, currentPassword: t('profile.security.currentPasswordIncorrect') }));
      }
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{formData.name || 'User'}</h1>
              <p className="text-blue-100">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('profile.title')}</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('profile.editProfile')}
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges()}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    hasChanges() 
                      ? 'bg-green-600 hover:bg-green-700 cursor-pointer' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {t('profile.saveChanges')}
                </button>
                <button
                  onClick={() => {
                    setFormData(originalData);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('profile.cancel')}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <FormInput
                label={t('profile.fields.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={false}
                placeholder={t('profile.placeholders.name')}
              />
              <FormInput
                label={t('profile.fields.email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={false}
                placeholder={t('profile.placeholders.email')}
              />
              <FormInput
                label={t('profile.fields.bio')}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={false}
                placeholder={t('profile.placeholders.bio')}
              />
              <FormInput
                label={t('profile.fields.location')}
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={false}
                placeholder={t('profile.placeholders.location')}
              />
              <FormInput
                label={t('profile.fields.website')}
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={false}
                placeholder={t('profile.placeholders.website')}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {formData.name && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('profile.fields.name')}</h3>
                  <p className="text-gray-900 dark:text-gray-100">{formData.name}</p>
                </div>
              )}
              {formData.email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('profile.fields.email')}</h3>
                  <p className="text-gray-900 dark:text-gray-100">{formData.email}</p>
                </div>
              )}
              {formData.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('profile.fields.bio')}</h3>
                  <p className="text-gray-900 dark:text-gray-100">{formData.bio}</p>
                </div>
              )}
              {formData.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('profile.fields.location')}</h3>
                  <p className="text-gray-900 dark:text-gray-100">{formData.location}</p>
                </div>
              )}
              {formData.website && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('profile.fields.website')}</h3>
                  <a href={formData.website} className="text-blue-600 hover:text-blue-800">
                    {formData.website}
                  </a>
                </div>
              )}
              {!formData.name && !formData.email && !formData.bio && !formData.location && !formData.website && (
                <p className="text-gray-500 dark:text-gray-400 italic">{t('profile.noProfileInfo')}</p>
              )}
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('profile.activityStats')}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.stats.posts')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.stats.todosCompleted')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">1</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.stats.daysActive')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('profile.security.title')}</h2>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {t('profile.security.changePassword')}
              </button>
            )}
          </div>

          {showPasswordSection ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.security.currentPassword')}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('profile.security.placeholders.currentPassword')}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.security.newPassword')}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('profile.security.placeholders.newPassword')}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('profile.security.passwordHint')}
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.security.confirmPassword')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('profile.security.placeholders.confirmPassword')}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('profile.security.updatePassword')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setPasswordErrors({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('profile.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>{t('profile.security.securityTips.title')}</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                <li>{t('profile.security.securityTips.tip1')}</li>
                <li>{t('profile.security.securityTips.tip2')}</li>
                <li>{t('profile.security.securityTips.tip3')}</li>
                <li>{t('profile.security.securityTips.tip4')}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMessage.title}
        message={modalMessage.message}
        type={modalMessage.type}
      />
    </div>
    </MainLayout>
  );
};

export default ProfilePage;