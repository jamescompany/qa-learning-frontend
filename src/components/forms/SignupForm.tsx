import React, { useState } from 'react';
import FormInput from './FormInput';
import { validateForm, emailValidation, passwordValidation } from './FormValidation';

interface SignupFormProps {
  onSubmit: (data: SignupData) => void;
  isLoading?: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, {
      name: { required: true, minLength: 2, maxLength: 50 },
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          if (value !== formData.password) {
            return 'Passwords do not match';
          }
          return null;
        },
      },
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter your full name"
        required
        disabled={isLoading}
      />
      
      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter your email"
        required
        disabled={isLoading}
      />
      
      <FormInput
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Create a password (min. 8 characters)"
        required
        disabled={isLoading}
      />
      
      <FormInput
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
        required
        disabled={isLoading}
      />
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;