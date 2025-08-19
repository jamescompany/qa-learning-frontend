import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/posts', label: 'Posts', icon: '📝' },
    { path: '/todos', label: 'Todos', icon: '✅' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/kanban', label: 'Kanban Board', icon: '📋' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    // Check for exact match or if current path starts with menu path (for nested routes)
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
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
            isSidebarOpen ? 'w-64' : 'w-16'
          } bg-white shadow-md transition-all duration-300 flex flex-col h-full`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full text-left text-gray-600 hover:text-gray-900"
            >
              {isSidebarOpen ? '◀️ Collapse' : '▶️'}
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
                  ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
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