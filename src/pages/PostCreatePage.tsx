import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/forms/PostForm';

const PostCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating post:', data);
      navigate('/posts');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default PostCreatePage;