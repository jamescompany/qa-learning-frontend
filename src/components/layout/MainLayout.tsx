import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Navigation from '../common/Navigation';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;