import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import PostForm from '../components/forms/PostForm';
import { usePostStore } from '../store/postStore';

const PostCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createPost } = usePostStore();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createPost(data);
      toast.success('Post created successfully!');
      navigate('/posts');
    } catch (error: any) {
      console.error('Failed to create post:', error);
      toast.error(error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostCreatePage;