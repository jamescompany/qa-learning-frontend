import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../common/Header';
import Navigation from '../common/Navigation';
import { useAuthStore } from '../../store/authStore';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation();

  const menuItems = [
    { path: '/dashboard', label: t('sidebar.overview'), icon: '📊' },
    { path: '/posts', label: t('sidebar.posts'), icon: '📝' },
    { path: '/todos', label: t('sidebar.todos'), icon: '✅' },
    { path: '/calendar', label: t('sidebar.calendar'), icon: '📅' },
    { path: '/kanban', label: t('sidebar.kanbanBoard'), icon: '📋' },
    { path: '/chat', label: t('sidebar.chat'), icon: '💬' },
    { path: '/settings', label: t('sidebar.settings'), icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    // Check for exact match or if current path starts with menu path (for nested routes)
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      
      <Navigation isAuthenticated={isAuthenticated} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col h-full`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ${
                isSidebarOpen ? 'text-left' : 'text-center'
              }`}
            >
              {isSidebarOpen ? (
                <span className="flex items-center">
                  <span>◀️</span>
                  <span className="ml-2">{t('sidebar.collapse')}</span>
                </span>
              ) : (
                <div className="flex flex-col items-center">
                  <span>▶️</span>
                  <span className="text-xs mt-1">{t('sidebar.expand')}</span>
                </div>
              )}
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm
                  transition-colors duration-200
                  ${isSidebarOpen ? '' : 'justify-center'}
                  ${
                    isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;