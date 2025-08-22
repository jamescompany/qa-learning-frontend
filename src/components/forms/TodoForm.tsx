import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from './FormInput';
import { validateForm } from './FormValidation';

interface TodoFormProps {
  onSubmit: (data: TodoData) => void;
  initialData?: TodoData;
  isLoading?: boolean;
}

interface TodoData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  onSubmit, 
  initialData,
  isLoading = false 
}) => {
  const { t } = useTranslation();
  
  // Convert date to YYYY-MM-DD format for input field
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };
  
  const [formData, setFormData] = useState<TodoData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    dueDate: formatDateForInput(initialData?.dueDate),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  
  // Check if form is valid (title is required)
  const isFormValid = formData.title.trim().length >= 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, {
      title: { required: true, minLength: 3, maxLength: 100 },
      description: { maxLength: 500 },
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('TodoForm submitting:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label={t('todos.form.fields.title')}
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title || (touched.title && !formData.title && t('todos.form.fields.titleRequired'))}
        placeholder={t('todos.form.fields.titlePlaceholder')}
        required
        disabled={isLoading}
      />
      
      <FormInput
        label={t('todos.form.fields.description')}
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder={t('todos.form.fields.descriptionPlaceholder')}
        multiline
        rows={3}
        disabled={isLoading}
      />
      
      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          {t('todos.form.fields.priority')}
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">{t('todos.form.fields.priorityLow')}</option>
          <option value="medium">{t('todos.form.fields.priorityMedium')}</option>
          <option value="high">{t('todos.form.fields.priorityHigh')}</option>
        </select>
      </div>
      
      <FormInput
        label={t('todos.form.fields.dueDate')}
        type="date"
        name="dueDate"
        value={formData.dueDate || ''}
        onChange={handleChange}
        error={errors.dueDate}
        disabled={isLoading}
      />
      
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        title={!isFormValid ? t('todos.form.validation.titleMinLength') : ''}
      >
        {isLoading ? t('todos.form.buttons.saving') : initialData ? t('todos.form.buttons.update') : t('todos.form.buttons.create')}
      </button>
    </form>
  );
};

export default TodoForm;