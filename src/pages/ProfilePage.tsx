import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import FormInput from '../components/forms/FormInput';
import { useAuthStore } from '../store/authStore';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save profile changes
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  return (
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
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
    </div>
  );
};

export default ProfilePage;