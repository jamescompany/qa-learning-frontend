import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useAuthStore } from '../../store/authStore';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;