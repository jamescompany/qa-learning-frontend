import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  isAuthenticated?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Show all nav items regardless of authentication status
  const navItems = [
    { path: '/', label: t('navigation.home'), requiresAuth: false },
    { path: '/dashboard', label: t('navigation.dashboard'), requiresAuth: true },
    { path: '/todos', label: t('navigation.myTodos'), requiresAuth: true },
    { path: '/posts', label: t('navigation.posts'), requiresAuth: true },
    { path: '/calendar', label: t('navigation.calendar'), requiresAuth: true },
    { path: '/kanban', label: t('navigation.kanban'), requiresAuth: true },
    { path: '/qa', label: t('navigation.qaTestingHub'), requiresAuth: true },
    { path: '/about', label: t('navigation.about'), requiresAuth: false },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    // If the item requires auth and user is not authenticated, redirect to login
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: item.path } } });
    }
  };

  return (
    <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className={({ isActive }) =>
                `py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
                } ${
                  item.requiresAuth && !isAuthenticated
                    ? 'opacity-75 cursor-pointer'
                    : ''
                }`
              }
              title={item.requiresAuth && !isAuthenticated ? t('navigation.loginRequired') : ''}
            >
              {item.label}
              {item.requiresAuth && !isAuthenticated && (
                <span className="ml-1 text-xs">🔒</span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;