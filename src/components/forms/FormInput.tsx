import React from 'react';
import { useTranslation } from 'react-i18next';

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
}) => {
  const { i18n } = useTranslation();
  
  const inputClasses = `
    w-full px-3 py-2 border rounded-md
    focus:outline-none focus:ring-2 focus:ring-blue-500
    ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
    ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-700'}
    text-gray-900 dark:text-gray-100
    ${type === 'date' ? 'date-input' : ''}
  `;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          lang={i18n.language}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormInput;