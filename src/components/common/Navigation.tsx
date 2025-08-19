import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated = false }) => {
  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/posts', label: 'Posts' },
    { path: '/qa', label: 'QA Testing Hub' },
    { path: '/about', label: 'About' },
  ];

  const privateNavItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/todos', label: 'My Todos' },
    { path: '/posts', label: 'Posts' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/kanban', label: 'Kanban' },
    { path: '/qa', label: 'QA Testing Hub' },
  ];

  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;