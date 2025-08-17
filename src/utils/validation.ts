// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Username validation
export const isValidUsername = (username: string): boolean => {
  // Alphanumeric, underscore, hyphen, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Date validation
export const isValidDate = (date: string): boolean => {
  const parsed = Date.parse(date);
  return !isNaN(parsed);
};

// Age validation
export const isValidAge = (birthDate: string, minAge: number = 0, maxAge: number = 120): boolean => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge;
  }
  
  return age >= minAge && age <= maxAge;
};

// File size validation
export const isValidFileSize = (size: number, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return size <= maxSizeInBytes;
};

// File type validation
export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

// String length validation
export const isValidLength = (str: string, min: number, max?: number): boolean => {
  const length = str.trim().length;
  if (max) {
    return length >= min && length <= max;
  }
  return length >= min;
};

// Number range validation
export const isInRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max;
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Form validation helper
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export const validateField = (value: any, rules: ValidationRule): string | null => {
  if (rules.required && !isRequired(value)) {
    return rules.message || 'This field is required';
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return rules.message || `Minimum length is ${rules.minLength} characters`;
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.message || `Maximum length is ${rules.maxLength} characters`;
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || 'Invalid format';
  }
  
  if (rules.custom) {
    return rules.custom(value);
  }
  
  return null;
};

// Validate multiple fields
export const validateForm = (
  formData: Record<string, any>,
  rules: Record<string, ValidationRule>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach((field) => {
    const error = validateField(formData[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

// Common validation messages
export const ValidationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  username: 'Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens',
  creditCard: 'Please enter a valid credit card number',
  date: 'Please enter a valid date',
  fileSize: 'File size exceeds the maximum allowed',
  fileType: 'File type is not allowed',
};