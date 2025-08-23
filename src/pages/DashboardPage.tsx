import React, { useEffect, useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import Loading from '../components/common/Loading';
import AnnouncementModal from '../components/common/AnnouncementModal';
import PostModal from '../components/common/PostModal';
import { useAuthStore } from '../store/authStore';
import { useTodoStore } from '../store/todoStore';
import { usePostStore } from '../store/postStore';
import { notices, isNewNotice } from '../data/notices';
import { generateUserActivities, getActivityIcon, formatTimeDifference } from '../data/activities';

interface DashboardStats {
  totalPosts: number;
  totalTodos: number;
  completedTodos: number;
  recentActivity: number;
}

const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const { getTodoStats, fetchTodos, isLoading: todosLoading } = useTodoStore();
  const todoStats = getTodoStats();
  const { posts, fetchPosts, isLoading: postsLoading } = usePostStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalTodos: 0,
    completedTodos: 0,
    recentActivity: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showMoreActivities, setShowMoreActivities] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    // Always fetch posts and todos on mount to ensure we have the latest data
    const loadData = async () => {
      await Promise.all([
        fetchPosts(),
        fetchTodos()
      ]);
      setIsInitialized(true);
    };
    loadData();
  }, [i18n.language]);

  useEffect(() => {
    // Use real data from stores
    setStats({
      totalPosts: posts.length,
      totalTodos: todoStats.total,
      completedTodos: todoStats.completed,
      recentActivity: posts.length + todoStats.total,
    });
  }, [posts.length, todoStats.total, todoStats.completed]);

  // Generate recent activity from real data using the activity module
  const recentActivities = useMemo(() => {
    return generateUserActivities(user, posts, t);
  }, [posts, user, t]);

  if (!isInitialized || postsLoading || todosLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('dashboard.welcome', { name: user?.full_name || user?.username || 'User' })}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Announcements Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              {t('dashboard.announcements.title')}
            </h2>
          </div>
          <div className="space-y-3">
            {notices.map((notice) => {
              const currentLang = i18n.language.startsWith('ko') ? 'ko' : 'en';
              return (
                <div 
                  key={notice.id}
                  className="flex items-start bg-white dark:bg-gray-800 rounded-md p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    const lang = i18n.language.startsWith('ko') ? 'ko' : 'en';
                    setSelectedAnnouncement({
                      title: notice.title[lang],
                      content: notice.content[lang],
                      date: notice.date,
                      guide: notice.guide ? {
                        steps: notice.guide.steps[lang],
                        note: notice.guide.note ? notice.guide.note[lang] : undefined
                      } : undefined
                    });
                    setShowAnnouncementModal(true);
                  }}
                >
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5"></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                          {notice.title[currentLang]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notice.content[currentLang]}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {notice.date}
                        </p>
                      </div>
                      {isNewNotice(notice.date) && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse">
                          {t('dashboard.announcements.new')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 h-5">{t('dashboard.stats.totalPosts')}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 h-9">{stats.totalPosts}</p>
              </div>
              <div className="text-blue-500 flex-shrink-0 ml-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-8 flex items-center">
              <Link to="/posts" className="text-sm text-blue-600 hover:text-blue-500">
                {t('dashboard.stats.viewAllPosts')}
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 h-5">{t('dashboard.stats.totalTodos')}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 h-9">{stats.totalTodos}</p>
              </div>
              <div className="text-green-500 flex-shrink-0 ml-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-8 flex items-center">
              <Link to="/todos" className="text-sm text-blue-600 hover:text-blue-500">
                {t('dashboard.stats.manageTodos')}
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 h-5">{t('dashboard.stats.completed')}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 h-9">{stats.completedTodos}</p>
              </div>
              <div className="text-purple-500 flex-shrink-0 ml-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-8">
              <div className="flex items-center h-full">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: stats.totalTodos > 0 ? `${(stats.completedTodos / stats.totalTodos) * 100}%` : '0%' }}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 w-10 text-right">
                  {stats.totalTodos > 0 ? Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 h-5">{t('dashboard.stats.recentActivity')}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 h-9">{stats.recentActivity}</p>
              </div>
              <div className="text-orange-500 flex-shrink-0 ml-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-8 flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.stats.lastDays', { days: 30 })}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('dashboard.quickActions.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/posts/create"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('dashboard.quickActions.createPost')}
            </Link>
            <Link
              to="/todos?add=true"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {t('dashboard.quickActions.addTodo')}
            </Link>
            <Link
              to="/calendar"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {t('dashboard.quickActions.viewCalendar')}
            </Link>
            <Link
              to="/profile"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('dashboard.quickActions.editProfile')}
            </Link>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('activity.title')}</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, showMoreActivities ? recentActivities.length : 3).map((activity, index) => {
                const iconConfig = getActivityIcon(activity.type);
                const getActivityTitle = () => {
                  if (activity.type === 'post') {
                    return `${t('activity.events.createdPost')}: "${activity.title}"`;
                  }
                  return activity.title;
                };

                return (
                  <div 
                    key={index} 
                    className={`flex items-start ${activity.type === 'post' ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2' : ''}`}
                    onClick={() => {
                      if (activity.type === 'post' && activity.data) {
                        setSelectedPost(activity.data);
                        setShowPostModal(true);
                      }
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${iconConfig.bgColor} flex items-center justify-center`}>
                        <svg className={`h-5 w-5 ${iconConfig.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconConfig.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm text-gray-900 dark:text-gray-100 ${activity.type === 'post' ? 'hover:text-blue-600 dark:hover:text-blue-400' : ''}`}>
                        {getActivityTitle()}
                      </p>
                      {activity.details && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {activity.details}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{formatTimeDifference(activity.timestamp, t)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('activity.noActivity')}
              </p>
            )}
            
            {/* Show More/Less Button */}
            {recentActivities.length > 3 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowMoreActivities(!showMoreActivities)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {showMoreActivities ? t('activity.showLess') : t('activity.showMore')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => {
          setShowAnnouncementModal(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement || {
          title: '',
          content: '',
          date: '',
        }}
      />
      
      {/* Post Modal */}
      <PostModal
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;