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
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    privacyAccepted: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isFormValid = 
    formData.name.trim().length >= 2 &&
    formData.email.trim().length > 0 &&
    formData.password.length >= 8 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword &&
    formData.termsAccepted &&
    formData.privacyAccepted;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const inputElement = e.target as HTMLInputElement;
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? inputElement.checked : value 
    }));
    
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
      termsAccepted: {
        custom: (value: boolean) => {
          if (!value) {
            return t('auth.signup.termsRequired');
          }
          return null;
        },
      },
      privacyAccepted: {
        custom: (value: boolean) => {
          if (!value) {
            return t('auth.signup.privacyRequired');
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
      
      <div className="space-y-3">
        <label className="flex items-start">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <a 
              href="/terms" 
              target="_blank" 
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {t('auth.signup.termsOfService')}
            </a>
            {t('auth.signup.agreeToTerms')}
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm ml-6">{errors.termsAccepted}</p>
        )}

        <label className="flex items-start">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <a 
              href="/privacy" 
              target="_blank" 
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {t('auth.signup.privacyPolicy')}
            </a>
            {t('auth.signup.agreeToPrivacy')}
          </span>
        </label>
        {errors.privacyAccepted && (
          <p className="text-red-500 text-sm ml-6">{errors.privacyAccepted}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          isLoading || !isFormValid
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? t('auth.signup.creating') : t('auth.signup.button')}
      </button>
    </form>
  );
};

export default SignupForm;