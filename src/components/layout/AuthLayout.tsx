import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold transition-colors">
              <span className="text-blue-600 dark:text-blue-400">QA</span>
              <span className="text-gray-900 dark:text-gray-100"> Learning 101</span>
            </h1>
          </Link>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.welcome')}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;