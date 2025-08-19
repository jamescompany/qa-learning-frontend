import React, { useState } from 'react';
import FormInput from './FormInput';
import { validateForm } from './FormValidation';

interface PostFormProps {
  onSubmit: (data: PostData) => void;
  initialData?: PostData;
  isLoading?: boolean;
}

interface PostData {
  title: string;
  content: string;
  tags: string[];
  published: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ 
  onSubmit, 
  initialData,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<PostData>(initialData || {
    title: '',
    content: '',
    tags: [],
    published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, {
      title: { required: true, minLength: 5, maxLength: 200 },
      content: { required: true, minLength: 10 },
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
        placeholder="Enter post title"
        required
        disabled={isLoading}
      />
      
      <FormInput
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        error={errors.content}
        placeholder="Write your post content..."
        multiline
        rows={10}
        required
        disabled={isLoading}
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Add Tag
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                disabled={isLoading}
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label={`Remove ${tag} tag`}
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            disabled={isLoading}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Publish immediately
          </span>
        </label>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
};

export default PostForm;