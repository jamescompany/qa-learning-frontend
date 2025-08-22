import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import PostForm from '../components/forms/PostForm';
import Loading from '../components/common/Loading';
import { usePostStore } from '../store/postStore';
import { useAuthStore } from '../store/authStore';

const PostEditPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const { currentPost, fetchPost, updatePost } = usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id && !initialData) {
      fetchPost(id).catch((error) => {
        console.error('Failed to fetch post:', error);
        toast.error(t('posts.edit.fetchError'));
        navigate('/posts');
      });
    }
  }, [id, fetchPost, navigate, t, initialData]);

  useEffect(() => {
    if (currentPost && id === currentPost.id && !initialData) {
      // Check if user is the author
      const isAuthor = user && (
        user.id === (currentPost as any).author_id || 
        user.id === (currentPost as any).author?.id
      );
      
      if (!isAuthor) {
        toast.error(t('posts.edit.notAuthorized'));
        navigate('/posts');
        return;
      }
      
      // Prepare initial data for the form
      setInitialData({
        title: currentPost.title,
        content: currentPost.content,
        tags: (currentPost as any).tags?.map((tag: any) => 
          typeof tag === 'string' ? tag : tag.name
        ) || [],
        published: (currentPost as any).status === 'published'
      });
    }
  }, [currentPost, id, user, navigate, t, initialData]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const postData = {
        ...data,
        status: data.published ? 'published' : 'draft'
      };
      delete postData.published;
      
      await updatePost(id, postData);
      toast.success(t('posts.edit.success'));
      navigate(`/posts/${id}`);
    } catch (error: any) {
      console.error('Failed to update post:', error);
      toast.error(error.response?.data?.detail || error.message || t('posts.edit.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" text={t('posts.edit.loading')} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('posts.edit.title')}
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <PostForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            initialData={initialData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostEditPage;