import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import Loading from '../components/common/Loading';
import ConfirmModal from '../components/common/ConfirmModal';
import { usePostStore } from '../store/postStore';
import { useAuthStore } from '../store/authStore';


const PostDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPost, fetchPost, addComment, likePost, unlikePost, deletePost, isLoading } = usePostStore();
  const { user } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id).catch((error) => {
        console.error('Failed to fetch post:', error);
        toast.error(t('posts.detail.fetchError'));
      });
    }
  }, [id, fetchPost, t]);

  // Update hasLiked when currentPost changes
  useEffect(() => {
    if (currentPost) {
      setHasLiked((currentPost as any).user_has_liked || false);
      console.log('CurrentPost updated:', currentPost);
      console.log('Comments in currentPost:', currentPost?.comments);
      console.log('User has liked:', (currentPost as any).user_has_liked);
    }
  }, [currentPost]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !currentPost) return;
    
    setIsAddingComment(true);
    try {
      await addComment(currentPost.id, commentText);
      setCommentText('');
      toast.success(t('posts.detail.commentAdded'));
      // Re-fetch the post to get updated comments
      await fetchPost(currentPost.id);
      console.log('Post after adding comment:', currentPost);
      console.log('Comments after adding:', currentPost?.comments);
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error(t('posts.detail.commentError'));
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleLike = async () => {
    if (!currentPost) return;
    
    try {
      if (hasLiked) {
        // Unlike functionality
        await unlikePost(currentPost.id);
        setHasLiked(false);
      } else {
        // Like functionality
        await likePost(currentPost.id);
        setHasLiked(true);
        toast.success(t('posts.detail.liked'));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error(t('posts.detail.likeError'));
    }
  };

  const handleDelete = async () => {
    if (!currentPost || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deletePost(currentPost.id);
      toast.success(t('posts.detail.deleted'));
      setShowDeleteModal(false);
      navigate('/posts');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error(t('posts.detail.deleteError'));
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleEdit = () => {
    if (!currentPost) return;
    navigate(`/posts/${currentPost.id}/edit`);
  };

  // Check if current user is the author
  const isAuthor = user && currentPost && (
    user.id === (currentPost as any).author_id || 
    user.id === (currentPost as any).author?.id
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" text={t('posts.detail.loading')} />
        </div>
      </DashboardLayout>
    );
  }

  if (!currentPost) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('posts.detail.notFound')}</p>
          <Link to="/posts" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            {t('posts.detail.backToPosts')}
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          {/* Post Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currentPost.title}</h1>
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {t('posts.detail.edit')}
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    {t('posts.detail.delete')}
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>{t('posts.detail.by')} {(currentPost as any).author?.full_name || (currentPost as any).author?.username || 'Unknown'}</span>
                <span>{new Date((currentPost as any).created_at || currentPost.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                >
                  <span>❤️</span>
                  <span>{(currentPost as any).likes_count || (currentPost as any).likes || 0}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {currentPost.tags?.map((tag: any, index: number) => (
              <span
                key={typeof tag === 'string' ? `${tag}-${index}` : `${tag.id || tag.name}-${index}`}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>

          {/* Post Content */}
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {currentPost.content}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('posts.detail.comments')} ({currentPost.comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <div className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t('posts.detail.addComment')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || isAddingComment}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingComment ? t('posts.detail.posting') : t('posts.detail.postComment')}
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {currentPost.comments?.map((comment: any) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{comment.author?.full_name || comment.author?.username || comment.author?.name || 'Anonymous'}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.created_at || comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            to="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← {t('posts.detail.backToPosts')}
          </Link>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('posts.detail.confirmDelete')}
        message={t('posts.detail.confirmDeleteMessage')}
        confirmText={t('posts.detail.delete')}
        cancelText={t('common.buttons.cancel')}
        isLoading={isDeleting}
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default PostDetailPage;