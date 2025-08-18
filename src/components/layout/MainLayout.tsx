import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Navigation from '../common/Navigation';
import { useAuthStore } from '../../store/authStore';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;