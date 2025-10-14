import React, { useState, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WhatsAppButton from '../components/WhatsAppButton';

const AppFooter: React.FC = () => (
  <footer className="bg-white border-t border-gray-200 px-6 py-3 text-xs text-gray-500">
    <div className="flex justify-between items-center">
      <span>© 2025 Golden Veicular. E-mail: <span className="font-semibold text-gray-600">contato@goldenveicular.com.br</span></span>
      <span>
        Desenvolvido por{' '}
        <a 
          href="https://agenciadipixel.com.br" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-bold text-gray-600 hover:text-[#000042]"
        >
          Agência DiPixel
        </a>
      </span>
    </div>
  </footer>
);

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { profile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={toggleSidebar} 
        userRole={profile?.role || 'user'} 
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
        <AppFooter />
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default UserLayout;
