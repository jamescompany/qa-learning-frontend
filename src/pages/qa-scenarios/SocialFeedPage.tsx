import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import TestingGuide from '../../components/qa/TestingGuide';
import { useAuthStore } from '../../store/authStore';
import { placeholderImages } from '../../utils/placeholderImage';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasNewStory: boolean;
}

const SocialFeedPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        username: '@sarahj',
        avatar: placeholderImages.avatarSJ,
        verified: true,
      },
      content: 'Just launched my new project! Excited to share it with everyone. Check it out and let me know what you think! 🚀 #launch #startup #tech',
      image: placeholderImages.projectLaunch,
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '2',
      author: {
        name: 'Tech News Daily',
        username: '@technews',
        avatar: placeholderImages.avatarTN,
        verified: true,
      },
      content: 'Breaking: Major tech company announces revolutionary AI breakthrough that could change everything we know about machine learning.',
      timestamp: '3 hours ago',
      likes: 1542,
      comments: 328,
      shares: 456,
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: '3',
      author: {
        name: 'Mike Chen',
        username: '@mikechen',
        avatar: placeholderImages.avatarMC,
        verified: false,
      },
      content: 'Beautiful sunset from my evening run today! Sometimes you just need to disconnect and enjoy nature. 🌅',
      image: placeholderImages.sunsetRun,
      timestamp: '5 hours ago',
      likes: 89,
      comments: 12,
      shares: 3,
      isLiked: false,
      isBookmarked: false,
    },
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePostId, setSharePostId] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [showFollowSuggestions, setShowFollowSuggestions] = useState(true);

  const stories: Story[] = [
    { id: '1', username: 'Your Story', avatar: placeholderImages.storyYou, hasNewStory: false },
    { id: '2', username: 'alexm', avatar: placeholderImages.storyAM, hasNewStory: true },
    { id: '3', username: 'emilyr', avatar: placeholderImages.storyER, hasNewStory: true },
    { id: '4', username: 'davidk', avatar: placeholderImages.storyDK, hasNewStory: false },
    { id: '5', username: 'lisap', avatar: placeholderImages.storyLP, hasNewStory: true },
    { id: '6', username: 'jamesw', avatar: placeholderImages.storyJW, hasNewStory: false },
  ];

  const trendingTopics = [
    { tag: '#TechNews', posts: '12.5K' },
    { tag: '#AI', posts: '8.3K' },
    { tag: '#WebDev', posts: '5.2K' },
    { tag: '#Startup', posts: '3.8K' },
    { tag: '#Design', posts: '2.9K' },
  ];

  const suggestedFollows = [
    { name: 'Alex Morgan', username: '@alexm', followers: '23.5K', avatar: placeholderImages.followAM },
    { name: 'Emily Ross', username: '@emilyr', followers: '18.2K', avatar: placeholderImages.followER },
    { name: 'David Kim', username: '@davidk', followers: '45.8K', avatar: placeholderImages.followDK },
  ];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newBookmarkState = !post.isBookmarked;
        toast.success(newBookmarkState ? 'Post saved' : 'Post removed from saved');
        return {
          ...post,
          isBookmarked: newBookmarkState,
        };
      }
      return post;
    }));
  };

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) {
      toast.error('Please write something');
      return;
    }

    const newPost: Post = {
      id: `${posts.length + 1}`,
      author: {
        name: 'You',
        username: '@you',
        avatar: placeholderImages.avatarYou,
        verified: false,
      },
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedImage(null);
    toast.success('Post published!');
  };

  const handleComment = () => {
    if (!commentText.trim()) {
      toast.error('Please write a comment');
      return;
    }
    toast.success('Comment posted!');
    setCommentText('');
    setShowCommentModal(false);
  };

  const handleShare = () => {
    toast.success('Post shared!');
    setShareMessage('');
    setShowShareModal(false);
  };

  const handleFollow = (username: string) => {
    toast.success(`Following ${username}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Common Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      
      {/* Social Feed Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30" data-testid="social-header">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SocialHub</h1>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, people, or hashtags..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  data-testid="search-bar"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" data-testid="home-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" data-testid="explore-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </button>
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" data-testid="notifications-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" data-testid="messages-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer" data-testid="profile-menu"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Testing Guide */}
        <TestingGuide
          title="Social Media Feed Testing Guide"
          description="Test social media interactions including posts, comments, likes, and real-time updates"
          scenarios={[
            {
              id: 'post-creation',
              title: 'Create and Edit Post',
              description: 'Test post creation with text, images, and privacy settings',
              steps: [
                'Click "What\'s on your mind?" to create post',
                'Enter post text',
                'Add image/photo',
                'Set privacy to "Friends Only"',
                'Submit post',
                'Verify post appears in feed',
                'Edit the post',
                'Verify changes are saved'
              ],
              expectedResult: 'Post is created, displayed, and editable',
              difficulty: 'easy'
            },
            {
              id: 'comment-interaction',
              title: 'Comment Thread Testing',
              description: 'Test commenting system and nested replies',
              steps: [
                'Find a post with comments',
                'Add a new comment',
                'Reply to existing comment',
                'Edit your comment',
                'Delete a comment',
                'Verify comment count updates',
                'Test @mentions in comments'
              ],
              expectedResult: 'All comment interactions work correctly',
              difficulty: 'medium'
            },
            {
              id: 'like-reaction',
              title: 'Like and Reaction System',
              description: 'Test various reaction types and counts',
              steps: [
                'Click like button on a post',
                'Verify like count increases',
                'Long press for reaction menu',
                'Select different reaction (Love, Laugh, etc.)',
                'Verify reaction changes',
                'Unlike the post',
                'Verify count decreases'
              ],
              expectedResult: 'Reactions update correctly and persist',
              difficulty: 'easy'
            },
            {
              id: 'story-functionality',
              title: 'Stories Feature',
              description: 'Test story creation and viewing',
              steps: [
                'Click "Add Story" button',
                'Upload image or video',
                'Add text overlay',
                'Set story duration',
                'Publish story',
                'View story in story bar',
                'Check story analytics (views)',
                'Verify 24-hour expiration'
              ],
              expectedResult: 'Stories upload and display correctly',
              difficulty: 'medium'
            },
            {
              id: 'share-functionality',
              title: 'Share and Repost',
              description: 'Test sharing posts to timeline or messages',
              steps: [
                'Click share button on a post',
                'Select "Share to Timeline"',
                'Add your comment',
                'Submit share',
                'Verify shared post appears',
                'Test "Share via Message"',
                'Select recipients',
                'Verify message sent'
              ],
              expectedResult: 'Posts share correctly to different destinations',
              difficulty: 'medium'
            },
            {
              id: 'infinite-scroll',
              title: 'Feed Infinite Scroll',
              description: 'Test feed loading and pagination',
              steps: [
                'Scroll to bottom of feed',
                'Verify loading indicator appears',
                'Verify new posts load',
                'Check for duplicate posts',
                'Test pull-to-refresh',
                'Verify new posts at top'
              ],
              expectedResult: 'Feed loads seamlessly without duplicates',
              difficulty: 'hard'
            }
          ]}
          tips={[
            'Test with different media types (images, videos, GIFs)',
            'Verify timestamps update correctly ("just now", "5 mins ago")',
            'Check notification triggers for interactions',
            'Test privacy settings (Public, Friends, Only Me)',
            'Verify real-time updates without page refresh',
            'Test character limits for posts and comments'
          ]}
          dataTestIds={[
            { element: 'create-post-button', description: 'New post button' },
            { element: 'post-text-input', description: 'Post text area' },
            { element: 'like-button', description: 'Like/reaction button' },
            { element: 'comment-input', description: 'Comment field' },
            { element: 'share-button', description: 'Share post button' },
            { element: 'story-add', description: 'Add story button' },
            { element: 'post-privacy', description: 'Privacy selector' },
            { element: 'feed-container', description: 'Main feed area' }
          ]}
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/qa')}
          className="mb-4 inline-flex items-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          data-testid="back-to-qa-hub"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to QA Testing Playground
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@johndoe</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-semibold">256</p>
                  <p className="text-gray-500 dark:text-gray-400">Posts</p>
                </div>
                <div>
                  <p className="font-semibold">1.2K</p>
                  <p className="text-gray-500 dark:text-gray-400">Followers</p>
                </div>
                <div>
                  <p className="font-semibold">589</p>
                  <p className="text-gray-500 dark:text-gray-400">Following</p>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Trending Topics</h3>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded cursor-pointer" data-testid={`trending-${index}`}>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{topic.tag}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{topic.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Stories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
              <div className="flex space-x-4 overflow-x-auto">
                {stories.map((story) => (
                  <div key={story.id} className="flex-shrink-0 text-center cursor-pointer" data-testid={`story-${story.id}`}>
                    <div className={`w-16 h-16 rounded-full p-0.5 ${story.hasNewStory ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full p-0.5">
                        <img src={story.avatar} alt={story.username} className="w-full h-full rounded-full object-cover" />
                      </div>
                    </div>
                    <p className="text-xs mt-1 text-gray-900 dark:text-gray-300">{story.username}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    rows={3}
                    data-testid="post-input"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" data-testid="add-photo-btn">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" data-testid="add-video-btn">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" data-testid="add-emoji-btn">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" data-testid="add-poll-btn">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={handlePostSubmit}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                      data-testid="post-submit-btn"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow" data-testid={`post-${post.id}`}>
                  <div className="p-4">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{post.author.name}</p>
                            {post.author.verified && (
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.username} · {post.timestamp}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" data-testid={`post-menu-${post.id}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="mb-3 text-gray-900 dark:text-gray-100">{post.content}</p>
                    
                    {/* Post Image */}
                    {post.image && (
                      <div className="mb-3 -mx-4">
                        <img src={post.image} alt="Post content" className="w-full" />
                      </div>
                    )}

                    {/* Post Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-4">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between border-t dark:border-gray-600 pt-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${post.isLiked ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}
                        data-testid={`like-btn-${post.id}`}
                      >
                        <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">Like</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPost(post.id);
                          setShowCommentModal(true);
                        }}
                        className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        data-testid={`comment-btn-${post.id}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">Comment</span>
                      </button>
                      <button
                        onClick={() => {
                          setSharePostId(post.id);
                          setShowShareModal(true);
                        }}
                        className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        data-testid={`share-btn-${post.id}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-2.684-5.368m2.684 5.368a3 3 0 00-2.684-5.368M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <span className="text-sm">Share</span>
                      </button>
                      <button
                        onClick={() => handleBookmark(post.id)}
                        className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${post.isBookmarked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                        data-testid={`bookmark-btn-${post.id}`}
                      >
                        <svg className="w-5 h-5" fill={post.isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="text-sm">Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100" data-testid="load-more-btn">
                Load More Posts
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* Suggested Follows */}
            {showFollowSuggestions && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Suggested for you</h3>
                  <button
                    onClick={() => setShowFollowSuggestions(false)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {suggestedFollows.map((user, index) => (
                    <div key={index} className="flex items-center justify-between" data-testid={`suggested-${index}`}>
                      <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.username} · {user.followers}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(user.username)}
                        className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                        data-testid={`follow-btn-${index}`}
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Online Friends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Online Friends</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((friend) => (
                  <div key={friend} className="flex items-center space-x-3" data-testid={`friend-${friend}`}>
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Friend {friend}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
                    </div>
                    <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="comment-modal">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Add a Comment</h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              rows={4}
              data-testid="comment-input"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                data-testid="comment-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleComment}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                data-testid="comment-submit"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="share-modal">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Share Post</h3>
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="Add a message (optional)..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
              data-testid="share-message"
            />
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button className="p-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600" data-testid="share-facebook">
                Facebook
              </button>
              <button className="p-3 bg-blue-400 dark:bg-blue-400 text-white rounded-lg hover:bg-blue-500 dark:hover:bg-blue-500" data-testid="share-twitter">
                Twitter
              </button>
              <button className="p-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600" data-testid="share-whatsapp">
                WhatsApp
              </button>
              <button className="p-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600" data-testid="share-copy-link">
                Copy Link
              </button>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                data-testid="share-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                data-testid="share-submit"
              >
                Share Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeedPage;