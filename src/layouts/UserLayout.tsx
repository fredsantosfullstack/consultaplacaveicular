import React, { useState, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

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
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          username={profile?.name || ''}
          balance={profile?.balance || 0}
          toggleSidebar={toggleSidebar}
          onLogout={logout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
