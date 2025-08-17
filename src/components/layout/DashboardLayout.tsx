import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../common/Header';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/posts', label: 'Posts', icon: '📝' },
    { path: '/dashboard/todos', label: 'Todos', icon: '✅' },
    { path: '/dashboard/calendar', label: 'Calendar', icon: '📅' },
    { path: '/dashboard/kanban', label: 'Kanban Board', icon: '📋' },
    { path: '/dashboard/chat', label: 'Chat', icon: '💬' },
    { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-16'
          } bg-white shadow-md transition-all duration-300`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full text-left text-gray-600 hover:text-gray-900"
            >
              {isSidebarOpen ? '◀️ Collapse' : '▶️'}
            </button>
          </div>
          
          <nav className="mt-4">
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
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;