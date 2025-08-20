import React, { useState } from 'react';
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
  const { i18n, t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  
  const inputClasses = `
    w-full px-3 py-2 border rounded-md
    focus:outline-none focus:ring-2 focus:ring-blue-500
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
  `;

  // For date inputs, show a text input with placeholder when empty
  const isDateInput = type === 'date';
  const showDatePlaceholder = isDateInput && !value && !isFocused;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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
        <div className="relative">
          {showDatePlaceholder && (
            <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
              <span className="text-gray-400">{t('common.datePlaceholder')}</span>
            </div>
          )}
          <input
            id={name}
            type={showDatePlaceholder ? 'text' : type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={!isDateInput ? placeholder : undefined}
            disabled={disabled}
            className={`${inputClasses} ${showDatePlaceholder ? 'text-transparent' : ''}`}
            lang={i18n.language}
            autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
          />
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;