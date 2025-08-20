import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from './FormInput';
import { validateForm, emailValidation } from './FormValidation';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void | Promise<void>;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      console.log('📝 Form submission:', { email: formData.email, password: '***' });
    }
    
    const validationErrors = validateForm(formData, {
      email: emailValidation,
      password: { required: true, minLength: 6 },
    });

    if (Object.keys(validationErrors).length > 0) {
      if (isDevelopment) {
        console.log('⚠️ Validation errors:', validationErrors);
      }
      setErrors(validationErrors);
      return;
    }

    if (isDevelopment) {
      console.log('✅ Form valid, submitting...');
    }
    
    onSubmit(formData.email, formData.password);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      noValidate
      action="#"
      method="POST"
    >
      <FormInput
        label={t('auth.login.email')}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder={t('auth.login.emailPlaceholder')}
        disabled={isLoading}
      />
      
      <FormInput
        label={t('auth.login.password')}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder={t('auth.login.passwordPlaceholder')}
        disabled={isLoading}
      />
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Logging in...' : t('auth.login.button')}
      </button>
    </form>
  );
};

export default LoginForm;