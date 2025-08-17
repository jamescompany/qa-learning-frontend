export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export const validateField = (value: any, rules: ValidationRule): string | null => {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required';
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format';
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (formData: any, rules: ValidationRules): { [field: string]: string } => {
  const errors: { [field: string]: string } = {};

  Object.keys(rules).forEach((field) => {
    const error = validateField(formData[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

export const emailValidation: ValidationRule = {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  custom: (value: string) => {
    if (!value.includes('@')) return 'Email must contain @';
    return null;
  },
};

export const passwordValidation: ValidationRule = {
  required: true,
  minLength: 8,
  custom: (value: string) => {
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return null;
  },
};