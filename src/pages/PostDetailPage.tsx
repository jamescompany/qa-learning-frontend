import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Loading from '../components/common/Loading';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // Load post from localStorage
    const loadPost = () => {
      const storedPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
      const foundPost = storedPosts.find((p: any) => p.id === id);
      
      if (foundPost) {
        // Transform to match our interface
        setPost({
          id: foundPost.id,
          title: foundPost.title,
          content: foundPost.content,
          author: foundPost.author?.name || 'Unknown Author',
          tags: foundPost.tags || [],
          createdAt: foundPost.createdAt,
          updatedAt: foundPost.updatedAt,
          likes: foundPost.likes || 0,
          comments: foundPost.comments || [],
        });
      }
      setIsLoading(false);
    };

    // Simulate loading delay for better UX
    setTimeout(loadPost, 500);
  }, [id]);

  const handleAddComment = () => {
    if (!commentText.trim() || !post) return;

    // Get current user name
    const mockUser = localStorage.getItem('mockUser');
    const authStorage = localStorage.getItem('auth-storage');
    let userName = 'Anonymous';
    
    if (mockUser) {
      const user = JSON.parse(mockUser);
      userName = user.full_name || user.name || user.username || user.email?.split('@')[0] || 'Anonymous';
    } else if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        const user = authData.state?.user;
        if (user) {
          userName = user.full_name || user.name || user.username || user.email?.split('@')[0] || 'Anonymous';
        }
      } catch (e) {
        console.error('Failed to parse auth storage', e);
      }
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: userName,
      content: commentText,
      createdAt: new Date().toISOString(),
    };

    // Update state
    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment],
    };
    setPost(updatedPost);
    
    // Save to localStorage
    const storedPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const postIndex = storedPosts.findIndex((p: any) => p.id === post.id);
    
    if (postIndex !== -1) {
      // Update existing post with new comment
      storedPosts[postIndex] = {
        ...storedPosts[postIndex],
        comments: [...(storedPosts[postIndex].comments || []), newComment],
      };
      localStorage.setItem('localPosts', JSON.stringify(storedPosts));
    }
    
    setCommentText('');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" text="Loading post..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Post not found</p>
          <Link to="/posts" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Back to Posts
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow p-8">
          {/* Post Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>By {post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-red-500 hover:text-red-600">
                  <span>❤️</span>
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Post Content */}
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700">
              {post.content}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comments ({post.comments.length})
            </h2>

            {/* Comment Form */}
            <div className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
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
            ← Back to Posts
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostDetailPage;