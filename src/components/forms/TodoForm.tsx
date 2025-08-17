import React, { useState } from 'react';
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
  const [formData, setFormData] = useState<TodoData>(initialData || {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter todo title"
        required
        disabled={isLoading}
      />
      
      <FormInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Enter todo description (optional)"
        multiline
        rows={3}
        disabled={isLoading}
      />
      
      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <FormInput
        label="Due Date"
        type="date"
        name="dueDate"
        value={formData.dueDate || ''}
        onChange={handleChange}
        error={errors.dueDate}
        disabled={isLoading}
      />
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Todo' : 'Create Todo'}
      </button>
    </form>
  );
};

export default TodoForm;