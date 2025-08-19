import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated = false }) => {
  const navigate = useNavigate();

  // Show all nav items regardless of authentication status
  const navItems = [
    { path: '/', label: 'Home', requiresAuth: false },
    { path: '/dashboard', label: 'Dashboard', requiresAuth: true },
    { path: '/todos', label: 'My Todos', requiresAuth: true },
    { path: '/posts', label: 'Posts', requiresAuth: true },
    { path: '/calendar', label: 'Calendar', requiresAuth: true },
    { path: '/kanban', label: 'Kanban', requiresAuth: true },
    { path: '/qa', label: 'QA Testing Hub', requiresAuth: true },
    { path: '/about', label: 'About', requiresAuth: false },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    // If the item requires auth and user is not authenticated, redirect to login
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: item.path } } });
    }
  };

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
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
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${
                  item.requiresAuth && !isAuthenticated
                    ? 'opacity-75 cursor-pointer'
                    : ''
                }`
              }
              title={item.requiresAuth && !isAuthenticated ? 'Login required' : ''}
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