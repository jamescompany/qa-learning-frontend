import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';
import { useAuthStore } from '../store/authStore';
import AuthLayout from '../components/layout/AuthLayout';

const SignupPage: React.FC = () => {
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
          Create your account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;