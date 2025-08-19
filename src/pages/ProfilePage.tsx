import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import FormInput from '../components/forms/FormInput';
import Modal from '../components/common/Modal';
import { useAuthStore } from '../store/authStore';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
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
        title: 'Success',
        message: 'Profile updated successfully!',
        type: 'success'
      });
      setShowModal(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setModalMessage({
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
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
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
      isValid = false;
    } else if (passwordData.currentPassword && passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      toast.success('Password changed successfully! Please log in with your new password.');
      
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      toast.error(errorMessage);
      if (errorMessage.toLowerCase().includes('current password')) {
        setPasswordErrors(prev => ({ ...prev, currentPassword: 'Current password is incorrect' }));
      }
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
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
            <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
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
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setFormData(originalData);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <FormInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={false}
                placeholder="Enter your name"
              />
              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={false}
                placeholder="Enter your email"
              />
              <FormInput
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={false}
                placeholder="Tell us about yourself"
              />
              <FormInput
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={false}
                placeholder="Enter your location"
              />
              <FormInput
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={false}
                placeholder="https://example.com"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {formData.name && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                  <p className="text-gray-900">{formData.name}</p>
                </div>
              )}
              {formData.email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p className="text-gray-900">{formData.email}</p>
                </div>
              )}
              {formData.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                  <p className="text-gray-900">{formData.bio}</p>
                </div>
              )}
              {formData.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-gray-900">{formData.location}</p>
                </div>
              )}
              {formData.website && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Website</h3>
                  <a href={formData.website} className="text-blue-600 hover:text-blue-800">
                    {formData.website}
                  </a>
                </div>
              )}
              {!formData.name && !formData.email && !formData.bio && !formData.location && !formData.website && (
                <p className="text-gray-500 italic">No profile information available. Click "Edit Profile" to add your information.</p>
              )}
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-500">Todos Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">1</p>
                <p className="text-sm text-gray-500">Days Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Security Settings</h2>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordSection ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
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
                  Update Password
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
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Password Security Tips:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-500 list-disc list-inside">
                <li>Use a strong password with at least 8 characters</li>
                <li>Include uppercase, lowercase letters, numbers, and symbols</li>
                <li>Don't use the same password for multiple accounts</li>
                <li>Change your password regularly</li>
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