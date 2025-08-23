import React from 'react';
import { useTranslation } from 'react-i18next';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    title: string;
    content: string;
    author?: {
      username?: string;
    };
    created_at: string;
    tags?: string[];
  } | null;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, post }) => {
  const { t } = useTranslation();

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {post.title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('posts.list.by')} {post.author?.username || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;