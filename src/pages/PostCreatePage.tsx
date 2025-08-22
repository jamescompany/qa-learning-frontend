import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import PostForm from '../components/forms/PostForm';
import { usePostStore } from '../store/postStore';

const PostCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createPost } = usePostStore();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const postData = {
        ...data,
        status: data.published ? 'published' : 'draft'
      };
      delete postData.published;
      
      console.log('Sending post data:', postData);
      
      await createPost(postData);
      toast.success(t('posts.create.success'));
      navigate('/posts');
    } catch (error: any) {
      console.error('Failed to create post:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors from backend
      let errorMessage = t('posts.create.error');
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          // Extract error messages from validation errors
          errorMessage = detail.map((err: any) => {
            if (typeof err === 'string') return err;
            if (err.msg) return err.msg;
            if (err.message) return err.message;
            return JSON.stringify(err);
          }).join(', ');
          console.error('Validation errors:', detail);
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('posts.create.title')}</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostCreatePage;