import { TFunction } from 'i18next';

export interface ActivityItem {
  type: 'post' | 'todo' | 'profile' | 'signup' | 'login';
  title: string;
  timestamp: Date;
  details?: string;
  data?: any;
}

export const generateUserActivities = (
  user: any,
  posts: any[],
  t: TFunction
): ActivityItem[] => {
  const activities: ActivityItem[] = [];
  
  // Add only user's own posts
  const userPosts = posts.filter(post => 
    post.author_id === user?.id || 
    post.author?.id === user?.id ||
    post.author?.username === user?.username
  );
  
  userPosts.forEach(post => {
    activities.push({
      type: 'post',
      title: post.title,
      timestamp: new Date(post.created_at),
      details: post.excerpt || post.content?.substring(0, 100),
      data: post
    });
  });
  
  const today = new Date();
  
  // Add simulated signup event (use actual created_at)
  if (user?.created_at) {
    const signupDate = new Date(user.created_at);
    activities.push({
      type: 'signup',
      title: t('activity.events.accountCreated'),
      timestamp: signupDate,
      details: t('activity.events.welcomeMessage')
    });
  }
  
  // Add profile update event (use actual updated_at if different from created_at)
  if (user?.updated_at && user.updated_at !== user.created_at) {
    const updateDate = new Date(user.updated_at);
    activities.push({
      type: 'profile',
      title: t('activity.events.updatedProfile'),
      timestamp: updateDate,
      details: t('activity.events.profileUpdateDetails')
    });
  }
  
  // Add login events only if account is old enough
  if (user?.created_at) {
    const signupDate = new Date(user.created_at);
    const hoursSinceSignup = Math.floor((today.getTime() - signupDate.getTime()) / (1000 * 60 * 60));
    
    // Only show login from yesterday if account is at least 1 day old
    if (hoursSinceSignup >= 24) {
      activities.push({
        type: 'login',
        title: t('activity.events.loggedIn'),
        timestamp: new Date(today.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        details: t('activity.events.loginFromDevice', { device: 'Safari on iPhone' })
      });
    }
    
    // Only show recent login if account is at least 2 hours old
    if (hoursSinceSignup >= 2) {
      activities.push({
        type: 'login',
        title: t('activity.events.loggedIn'),
        timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        details: t('activity.events.loginFromDevice', { device: 'Chrome on Windows' })
      });
    } else if (hoursSinceSignup >= 0.5) {
      // If account is between 30 min and 2 hours old, show login 30 min after signup
      activities.push({
        type: 'login',
        title: t('activity.events.loggedIn'),
        timestamp: new Date(signupDate.getTime() + 30 * 60 * 1000), // 30 min after signup
        details: t('activity.events.loginFromDevice', { device: 'Chrome on Windows' })
      });
    }
  }
  
  // Sort by timestamp (most recent first)
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return activities;
};

export const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'post':
      return {
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      };
    case 'signup':
      return {
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
      };
    case 'login':
      return {
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
      };
    case 'profile':
      return {
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      };
    default:
      return {
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-600',
        icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      };
  }
};

export const formatTimeDifference = (date: Date, t: TFunction): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 1) return `${days} ${t('activity.time.daysAgo')}`;
  if (days === 1) return t('activity.time.yesterday');
  if (hours >= 2) return t('activity.time.hoursAgo', { hours });
  if (hours === 1) return t('activity.time.oneHourAgo');
  if (minutes < 60) return t('activity.time.today');
  return t('activity.time.today');
};