import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isFormValid = 
    formData.name.trim().length >= 2 &&
    formData.email.trim().length > 0 &&
    formData.password.length >= 8 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

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
        label={t('auth.signup.fullName')}
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder={t('auth.signup.fullNamePlaceholder')}
        required
        disabled={isLoading}
      />
      
      <FormInput
        label={t('auth.signup.email')}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder={t('auth.signup.emailPlaceholder')}
        required
        disabled={isLoading}
      />
      
      <FormInput
        label={t('auth.signup.password')}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder={t('auth.signup.passwordPlaceholder')}
        required
        disabled={isLoading}
      />
      
      <FormInput
        label={t('auth.signup.confirmPassword')}
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder={t('auth.signup.confirmPasswordPlaceholder')}
        required
        disabled={isLoading}
      />
      
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          isLoading || !isFormValid
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Creating account...' : t('auth.signup.button')}
      </button>
    </form>
  );
};

export default SignupForm;