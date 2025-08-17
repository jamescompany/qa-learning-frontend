import React from 'react';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            QA Learning Web
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to your learning platform
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg px-8 py-10">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;