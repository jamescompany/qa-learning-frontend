import { useState, useCallback, useEffect, FormEvent, ChangeEvent } from 'react';
import { ValidationRule, validateField } from '../utils/validation';

interface FormErrors {
  [key: string]: string | undefined;
}

interface FormTouched {
  [key: string]: boolean;
}

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationRules?: Record<keyof T, ValidationRule>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e?: FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: FormErrors) => void;
  resetForm: (newValues?: T) => void;
  validateForm: () => boolean;
  validateField: (field: keyof T) => boolean;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const {
    initialValues,
    validationRules = {} as Record<keyof T, ValidationRule>,
    validateOnChange = true,
    validateOnBlur = true,
    onSubmit,
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && 
                  Object.keys(validationRules).every(field => {
                    const rules = validationRules[field as keyof T];
                    if (!rules?.required) return true;
                    const value = values[field as keyof T];
                    return value !== undefined && value !== '';
                  });

  // Validate a single field
  const validateSingleField = useCallback((field: keyof T): boolean => {
    const rules = validationRules[field];
    if (!rules) return true;

    const value = values[field];
    const error = validateField(String(value), rules);

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
      return true;
    }
  }, [values, validationRules]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field as keyof T];
      if (rules) {
        const value = values[field as keyof T];
        const error = validateField(String(value), rules);
        if (error) {
          newErrors[field] = error;
          isFormValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [values, validationRules]);

  // Handle input change
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    setIsDirty(true);

    // Validate on change if enabled
    if (validateOnChange && touched[name]) {
      setTimeout(() => {
        validateSingleField(name as keyof T);
      }, 0);
    }
  }, [touched, validateOnChange, validateSingleField]);

  // Handle input blur
  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      validateSingleField(name as keyof T);
    }
  }, [validateOnBlur, validateSingleField]);

  // Handle form submit
  const handleSubmit = useCallback(async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Touch all fields
    const allTouched: FormTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }

    // Submit form
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setIsDirty(false);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Set field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);

    if (validateOnChange && touched[field as string]) {
      setTimeout(() => {
        validateSingleField(field);
      }, 0);
    }
  }, [touched, validateOnChange, validateSingleField]);

  // Set field error programmatically
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  // Set field touched programmatically
  const setFieldTouched = useCallback((field: keyof T, touchedValue = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: touchedValue,
    }));
  }, []);

  // Set multiple values
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
    setIsDirty(true);
  }, []);

  // Set multiple errors
  const setMultipleErrors = useCallback((newErrors: FormErrors) => {
    setErrors(newErrors);
  }, []);

  // Reset form
  const resetForm = useCallback((newValues?: T) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Auto-validate on mount if there are initial values
  useEffect(() => {
    const hasInitialValues = Object.values(initialValues).some(v => v !== undefined && v !== '');
    if (hasInitialValues && Object.keys(validationRules).length > 0) {
      validateForm();
    }
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues: setMultipleValues,
    setErrors: setMultipleErrors,
    resetForm,
    validateForm,
    validateField: validateSingleField,
  };
}

// File upload hook
export function useFileUpload(options: {
  maxSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
}) {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [], multiple = false, onUpload } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${maxSize / 1024 / 1024}MB`;
    }

    // Check file type
    if (allowedTypes.length > 0) {
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      const isAllowed = allowedTypes.some(type => {
        if (type.includes('*')) {
          const [category] = type.split('/');
          return fileType.startsWith(category);
        }
        return fileType === type || fileExtension === type.replace('.', '');
      });

      if (!isAllowed) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  }, [maxSize, allowedTypes]);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (!multiple && selectedFiles.length > 1) {
      setError('Only one file is allowed');
      return;
    }

    // Validate files
    for (const file of selectedFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setFiles(selectedFiles);
    setError(null);
  }, [multiple, validateFile]);

  const upload = useCallback(async () => {
    if (files.length === 0 || !onUpload) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await onUpload(files);
      setProgress(100);
      setFiles([]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  }, [files, onUpload]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setProgress(0);
    setError(null);
    setUploading(false);
  }, []);

  return {
    files,
    uploading,
    progress,
    error,
    handleFileSelect,
    upload,
    removeFile,
    reset,
  };
}

// Debounced input hook
export function useDebouncedInput<T = string>(
  initialValue: T,
  delay = 300
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}

// Form field hook for individual field management
export function useField<T = string>({
  name,
  initialValue,
  validate,
}: {
  name: string;
  initialValue: T;
  validate?: (value: T) => string | undefined;
}) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value as unknown as T;
    setValue(newValue);

    if (touched && validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }
  }, [touched, validate]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
    }
  }, [value, validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    onChange: handleChange,
    onBlur: handleBlur,
    setValue,
    setError,
    setTouched,
    reset,
    field: {
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
  };
}