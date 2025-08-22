import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  // Default posts for initial state
  const defaultPosts: Post[] = [
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
  ];

  // Load posts from localStorage or use default
  const loadPosts = (): Post[] => {
    const saved = localStorage.getItem('qa-social-posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved posts', e);
        return defaultPosts;
      }
    }
    return defaultPosts;
  };

  const [posts, setPosts] = useState<Post[]>(loadPosts());

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('qa-social-posts', JSON.stringify(posts));
  }, [posts]);

  // Load followed users from localStorage
  useEffect(() => {
    const savedFollows = localStorage.getItem('qa-social-follows');
    if (savedFollows) {
      try {
        setFollowedUsers(JSON.parse(savedFollows));
      } catch (e) {
        console.error('Failed to parse saved follows', e);
      }
    }
  }, []);

  // Save followed users to localStorage
  useEffect(() => {
    localStorage.setItem('qa-social-follows', JSON.stringify(followedUsers));
  }, [followedUsers]);

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
      image: imagePreview || undefined,
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
    setImagePreview(null);
    setVideoPreview(null);
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
    if (followedUsers.includes(username)) {
      setFollowedUsers(followedUsers.filter(u => u !== username));
      toast.success(`Unfollowed ${username}`);
    } else {
      setFollowedUsers([...followedUsers, username]);
      toast.success(`Following ${username}`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setVideoPreview(null);
      };
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size should be less than 50MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewPostContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleCreatePoll = () => {
    const validOptions = pollOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error('Please add at least 2 poll options');
      return;
    }
    setNewPostContent(prev => `${prev}\n\n📊 Poll: ${validOptions.join(' | ')}`);
    setShowPollCreator(false);
    setPollOptions(['', '']);
  };

  const handleStoryClick = (story: Story) => {
    setCurrentStory(story);
    setShowStoryViewer(true);
    if (story.hasNewStory) {
      const updatedStories = stories.map(s => 
        s.id === story.id ? { ...s, hasNewStory: false } : s
      );
    }
  };

  const handleAddStory = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*,video/*';
      fileInputRef.current.click();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      const filtered = posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length === 0) {
        toast('No posts found');
      }
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const newPosts: Post[] = [
        {
          id: `${posts.length + 1}`,
          author: {
            name: 'Jane Smith',
            username: '@janesmith',
            avatar: placeholderImages.avatarYou,
            verified: false,
          },
          content: 'Just discovered this amazing coffee shop downtown! The atmosphere is perfect for working. ☕',
          timestamp: '7 hours ago',
          likes: 45,
          comments: 8,
          shares: 2,
          isLiked: false,
          isBookmarked: false,
        },
        {
          id: `${posts.length + 2}`,
          author: {
            name: 'Dev Community',
            username: '@devcom',
            avatar: placeholderImages.avatarTN,
            verified: true,
          },
          content: '🔥 Hot tip: Always write tests for your code. Your future self will thank you!',
          timestamp: '9 hours ago',
          likes: 892,
          comments: 156,
          shares: 234,
          isLiked: false,
          isBookmarked: false,
        },
      ];
      setPosts([...posts, ...newPosts]);
      setIsLoadingMore(false);
      toast.success('Loaded more posts');
    }, 1000);
  };

  const handlePostEdit = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  };

  const handlePostUpdate = () => {
    if (editingPost && editContent.trim()) {
      setPosts(posts.map(post => 
        post.id === editingPost 
          ? { ...post, content: editContent }
          : post
      ));
      toast.success('Post updated');
      setEditingPost(null);
      setEditContent('');
    }
  };

  const handlePostDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted');
    }
  };

  const emojis = ['😀', '😍', '🤣', '😎', '🤔', '👍', '❤️', '🔥', '🎉', '💯', '😢', '😡'];

  // Reset all data to default
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to default? This will clear all your posts and follows.')) {
      localStorage.removeItem('qa-social-posts');
      localStorage.removeItem('qa-social-follows');
      setPosts(defaultPosts);
      setFollowedUsers([]);
      toast.success('All data has been reset to default');
    }
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              <button 
                onClick={handleResetData}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
                data-testid="reset-data-btn"
                title="Reset all data"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
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
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
                data-testid="notifications-btn"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button 
                onClick={() => setShowMessages(!showMessages)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
                data-testid="messages-btn"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer" 
                data-testid="profile-menu"
              ></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Testing Guide */}
        <TestingGuide
          title={t('social.testingGuide.title')}
          description={t('social.testingGuide.description')}
          scenarios={[
            {
              id: 'post-creation',
              title: t('social.testingGuide.scenarios.postCreation.title'),
              description: t('social.testingGuide.scenarios.postCreation.description'),
              steps: [
                t('social.testingGuide.scenarios.postCreation.steps.1'),
                t('social.testingGuide.scenarios.postCreation.steps.2'),
                t('social.testingGuide.scenarios.postCreation.steps.3'),
                t('social.testingGuide.scenarios.postCreation.steps.4'),
                t('social.testingGuide.scenarios.postCreation.steps.5'),
                t('social.testingGuide.scenarios.postCreation.steps.6'),
                t('social.testingGuide.scenarios.postCreation.steps.7'),
                t('social.testingGuide.scenarios.postCreation.steps.8')
              ],
              expectedResult: t('social.testingGuide.scenarios.postCreation.expectedResult'),
              difficulty: 'easy'
            },
            {
              id: 'comment-interaction',
              title: t('social.testingGuide.scenarios.commentInteraction.title'),
              description: t('social.testingGuide.scenarios.commentInteraction.description'),
              steps: [
                t('social.testingGuide.scenarios.commentInteraction.steps.1'),
                t('social.testingGuide.scenarios.commentInteraction.steps.2'),
                t('social.testingGuide.scenarios.commentInteraction.steps.3'),
                t('social.testingGuide.scenarios.commentInteraction.steps.4'),
                t('social.testingGuide.scenarios.commentInteraction.steps.5'),
                t('social.testingGuide.scenarios.commentInteraction.steps.6'),
                t('social.testingGuide.scenarios.commentInteraction.steps.7')
              ],
              expectedResult: t('social.testingGuide.scenarios.commentInteraction.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'like-reaction',
              title: t('social.testingGuide.scenarios.likeReaction.title'),
              description: t('social.testingGuide.scenarios.likeReaction.description'),
              steps: [
                t('social.testingGuide.scenarios.likeReaction.steps.1'),
                t('social.testingGuide.scenarios.likeReaction.steps.2'),
                t('social.testingGuide.scenarios.likeReaction.steps.3'),
                t('social.testingGuide.scenarios.likeReaction.steps.4'),
                t('social.testingGuide.scenarios.likeReaction.steps.5'),
                t('social.testingGuide.scenarios.likeReaction.steps.6'),
                t('social.testingGuide.scenarios.likeReaction.steps.7')
              ],
              expectedResult: t('social.testingGuide.scenarios.likeReaction.expectedResult'),
              difficulty: 'easy'
            },
            {
              id: 'story-functionality',
              title: t('social.testingGuide.scenarios.storyFunctionality.title'),
              description: t('social.testingGuide.scenarios.storyFunctionality.description'),
              steps: [
                t('social.testingGuide.scenarios.storyFunctionality.steps.1'),
                t('social.testingGuide.scenarios.storyFunctionality.steps.2'),
                t('social.testingGuide.scenarios.storyFunctionality.steps.3'),
                t('social.testingGuide.scenarios.storyFunctionality.steps.4'),
                t('social.testingGuide.scenarios.storyFunctionality.steps.5'),
                t('social.testingGuide.scenarios.storyFunctionality.steps.6'),
                t('social.testingGuide.scenarios.storyFunctionality.steps.7'),
                t('social.testingGuide.scenarios.storyFunctionality.steps.8')
              ],
              expectedResult: t('social.testingGuide.scenarios.storyFunctionality.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'share-functionality',
              title: t('social.testingGuide.scenarios.shareFunctionality.title'),
              description: t('social.testingGuide.scenarios.shareFunctionality.description'),
              steps: [
                t('social.testingGuide.scenarios.shareFunctionality.steps.1'),
                t('social.testingGuide.scenarios.shareFunctionality.steps.2'),
                t('social.testingGuide.scenarios.shareFunctionality.steps.3'),
                t('social.testingGuide.scenarios.shareFunctionality.steps.4'),
                t('social.testingGuide.scenarios.shareFunctionality.steps.5'),
                t('social.testingGuide.scenarios.shareFunctionality.steps.6'),
                t('social.testingGuide.scenarios.shareFunctionality.steps.7'),
                t('social.testingGuide.scenarios.shareFunctionality.steps.8')
              ],
              expectedResult: t('social.testingGuide.scenarios.shareFunctionality.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'infinite-scroll',
              title: t('social.testingGuide.scenarios.infiniteScroll.title'),
              description: t('social.testingGuide.scenarios.infiniteScroll.description'),
              steps: [
                t('social.testingGuide.scenarios.infiniteScroll.steps.1'),
                t('social.testingGuide.scenarios.infiniteScroll.steps.2'),
                t('social.testingGuide.scenarios.infiniteScroll.steps.3'),
                t('social.testingGuide.scenarios.infiniteScroll.steps.4'),
                t('social.testingGuide.scenarios.infiniteScroll.steps.5'),
                t('social.testingGuide.scenarios.infiniteScroll.steps.6')
              ],
              expectedResult: t('social.testingGuide.scenarios.infiniteScroll.expectedResult'),
              difficulty: 'hard'
            }
          ]}
          tips={[
            t('social.testingGuide.tips.1'),
            t('social.testingGuide.tips.2'),
            t('social.testingGuide.tips.3'),
            t('social.testingGuide.tips.4'),
            t('social.testingGuide.tips.5'),
            t('social.testingGuide.tips.6')
          ]}
          dataTestIds={[
            { element: 'create-post-button', description: t('social.testingGuide.testIds.createPostButton') },
            { element: 'post-text-input', description: t('social.testingGuide.testIds.postTextInput') },
            { element: 'like-button', description: t('social.testingGuide.testIds.likeButton') },
            { element: 'comment-input', description: t('social.testingGuide.testIds.commentInput') },
            { element: 'share-button', description: t('social.testingGuide.testIds.shareButton') },
            { element: 'story-add', description: t('social.testingGuide.testIds.storyAdd') },
            { element: 'post-privacy', description: t('social.testingGuide.testIds.postPrivacy') },
            { element: 'feed-container', description: t('social.testingGuide.testIds.feedContainer') }
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
          {t('social.backButton')}
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
                  <div 
                    key={index} 
                    onClick={() => {
                      setSearchQuery(topic.tag);
                      handleSearch();
                    }}
                    className="flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded cursor-pointer" 
                    data-testid={`trending-${index}`}
                  >
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
                  <div 
                    key={story.id} 
                    onClick={() => story.id === '1' ? handleAddStory() : handleStoryClick(story)}
                    className="flex-shrink-0 text-center cursor-pointer" 
                    data-testid={`story-${story.id}`}
                  >
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
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" 
                        data-testid="add-photo-btn"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => videoInputRef.current?.click()}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" 
                        data-testid="add-video-btn"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" 
                        data-testid="add-emoji-btn"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setShowPollCreator(!showPollCreator)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" 
                        data-testid="add-poll-btn"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                    {/* Hidden file inputs */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={handlePostSubmit}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                      data-testid="post-submit-btn"
                    >
                      Post
                    </button>
                  </div>
                  {/* Image/Video Preview */}
                  {(imagePreview || videoPreview) && (
                    <div className="mt-3 relative">
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="rounded-lg max-h-64 w-full object-cover" />
                      )}
                      {videoPreview && (
                        <video src={videoPreview} controls className="rounded-lg max-h-64 w-full" />
                      )}
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setVideoPreview(null);
                          setSelectedImage(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="grid grid-cols-6 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="text-2xl hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Poll Creator */}
                  {showPollCreator && (
                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Create a Poll</h4>
                      {pollOptions.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      ))}
                      <div className="flex justify-between">
                        <button
                          onClick={handleAddPollOption}
                          className="text-blue-600 dark:text-blue-400 text-sm"
                          disabled={pollOptions.length >= 4}
                        >
                          + Add option
                        </button>
                        <button
                          onClick={handleCreatePoll}
                          className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded text-sm"
                        >
                          Add Poll
                        </button>
                      </div>
                    </div>
                  )}
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
                      <div className="relative">
                        <button 
                          onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
                          data-testid={`post-menu-${post.id}`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                        {showPostMenu === post.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                handlePostEdit(post.id);
                                setShowPostMenu(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              Edit Post
                            </button>
                            <button
                              onClick={() => {
                                handlePostDelete(post.id);
                                setShowPostMenu(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                            >
                              Delete Post
                            </button>
                          </div>
                        )}
                      </div>
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
              <button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50" 
                data-testid="load-more-btn"
              >
                {isLoadingMore ? 'Loading...' : 'Load More Posts'}
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
                        className={`px-3 py-1 text-sm rounded-lg ${
                          followedUsers.includes(user.username)
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                            : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                        }`}
                        data-testid={`follow-btn-${index}`}
                      >
                        {followedUsers.includes(user.username) ? 'Following' : 'Follow'}
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
                {[
                  { id: 1, name: 'Sarah Lee', avatar: placeholderImages.friend1 },
                  { id: 2, name: 'Tom Wilson', avatar: placeholderImages.friend2 },
                  { id: 3, name: 'Emma Davis', avatar: placeholderImages.friend3 },
                  { id: 4, name: 'Chris Brown', avatar: placeholderImages.friend4 }
                ].map((friend) => (
                  <div key={friend.id} className="flex items-center space-x-3" data-testid={`friend-${friend.id}`}>
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{friend.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
                    </div>
                    <button 
                      onClick={() => toast.success(`Opening chat with ${friend.name}`)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
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

      {/* Story Viewer Modal */}
      {showStoryViewer && currentStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-md w-full h-full max-h-[80vh] flex flex-col">
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={currentStory.avatar} alt={currentStory.username} className="w-10 h-10 rounded-full border-2 border-white" />
                <span className="text-white font-medium">{currentStory.username}</span>
              </div>
              <button
                onClick={() => {
                  setShowStoryViewer(false);
                  setCurrentStory(null);
                }}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-white text-lg mb-4">Story from {currentStory.username}</p>
                <p className="text-gray-400">Story content would appear here</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <input
                type="text"
                placeholder="Reply to story..."
                className="w-full px-4 py-2 bg-white bg-opacity-20 backdrop-blur text-white placeholder-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-32 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {[
              { type: 'like', user: 'Sarah Johnson', action: 'liked your post', time: '2 min ago' },
              { type: 'comment', user: 'Mike Chen', action: 'commented on your post', time: '15 min ago' },
              { type: 'follow', user: 'Emily Ross', action: 'started following you', time: '1 hour ago' },
              { type: 'mention', user: 'Tech News', action: 'mentioned you in a post', time: '3 hours ago' },
            ].map((notif, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-medium">{notif.user}</span> {notif.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t dark:border-gray-700">
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View all notifications</button>
          </div>
        </div>
      )}

      {/* Messages Dropdown */}
      {showMessages && (
        <div className="fixed top-16 right-16 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Messages</h3>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {[
              { user: 'Alex Morgan', message: 'Hey, how are you?', time: 'Now', unread: true },
              { user: 'David Kim', message: 'Thanks for sharing!', time: '30 min ago', unread: true },
              { user: 'Lisa Park', message: 'See you tomorrow', time: '2 hours ago', unread: false },
              { user: 'James Wilson', message: 'Great post!', time: 'Yesterday', unread: false },
            ].map((msg, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    {msg.unread && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{msg.user}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{msg.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{msg.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t dark:border-gray-700">
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">Open Messages</button>
          </div>
        </div>
      )}

      {/* Profile Menu Dropdown */}
      {showProfileMenu && (
        <div className="fixed top-16 right-4 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40">
          <div className="p-3 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">John Doe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@johndoe</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
              View Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
              Edit Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
              Settings
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
              Saved Posts
            </button>
            <hr className="my-2 dark:border-gray-700" />
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Post</h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setEditingPost(null);
                  setEditContent('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingPost && editContent.trim()) {
                    setPosts(posts.map(post => 
                      post.id === editingPost 
                        ? { ...post, content: editContent }
                        : post
                    ));
                    toast.success('Post updated');
                    setEditingPost(null);
                    setEditContent('');
                  }
                }}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeedPage;