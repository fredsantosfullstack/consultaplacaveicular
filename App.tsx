import React, { useState, useEffect } from 'react';
import { Notification, User } from './types';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import ConsultationHistory from './pages/ConsultationHistory';
import MyOrders from './pages/MyOrders';
import FinancialHistory from './pages/FinancialHistory';
import CreditRecharge from './pages/CreditRecharge';
import ApiDocs from './pages/ApiDocs';
import Admin from './pages/Admin';
import TermsOfUse from './pages/TermsOfUse';
import { FaBell, FaTimes } from 'react-icons/fa';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

const NotificationModal: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => (
    <div className="fixed top-5 right-5 bg-white w-full max-w-sm rounded-xl shadow-2xl p-5 border border-gray-200 animate-fade-in z-50">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                 <FaBell className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
            </button>
        </div>
    </div>
);

// Mock user data
const initialUsers: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@portaldospachantes.com.br', role: 'admin', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=admin@example.com' },
    { id: '2', name: 'Fredson Luz', email: 'fredson@example.com', role: 'user', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=fredson@example.com' },
    { id: '3', name: 'Maria Souza', email: 'maria.s@example.com', role: 'user', status: 'inactive', avatarUrl: 'https://i.pravatar.cc/150?u=maria.s@example.com' },
    { id: '4', name: 'Carlos Pereira', email: 'carlos.p@example.com', role: 'user', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=carlos.p@example.com' },
];


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState<'user' | 'admin'>('user'); // Default to 'user'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [balance, setBalance] = useState(123.45); // Dummy balance
    const navigate = useNavigate();
    
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        try {
            const saved = localStorage.getItem('appNotifications');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse notifications from localStorage", error);
            return [];
        }
    });

    const [visibleNotification, setVisibleNotification] = useState<Notification | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);

    useEffect(() => {
        localStorage.setItem('appNotifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        if (userRole === 'user') {
            const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '{}');
            
            // Find the first active notification that should be displayed
            const notificationToShow = notifications.find(n => {
                if (n.status !== 'active') {
                    return false; // Not active, don't show
                }
                
                const lastDismissedTime = dismissedNotifications[n.id];

                // If never dismissed, show it
                if (!lastDismissedTime) {
                    return true;
                }
                
                // If dismissed, check frequency
                const now = new Date().getTime();
                switch (n.frequency) {
                    case 'hourly':
                        return now - lastDismissedTime > 3600000;
                    case 'daily':
                        return now - lastDismissedTime > 86400000;
                    case 'once':
                    default:
                        return false; // Dismissed once, never show again
                }
            });
            
            setVisibleNotification(notificationToShow || null);
        } else {
            // If user is admin, never show notifications
            setVisibleNotification(null);
        }
    }, [notifications, userRole]); // Removed currentPage from dependencies

    const handleLogin = (name: string) => {
        setIsLoggedIn(true);
        setUsername(name.split('@')[0]); // Use part of email as name
        // Simple logic to set admin role for demonstration
        if (name.toLowerCase() === 'admin@portaldospachantes.com.br') {
            setUserRole('admin');
        } else {
            setUserRole('user');
        }
        navigate('/dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setUserRole('user');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCloseNotification = () => {
        if (visibleNotification) {
            const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '{}');
            dismissedNotifications[visibleNotification.id] = new Date().getTime();
            localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
            setVisibleNotification(null);
        }
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                userRole={userRole}
                handleLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    username={username}
                    balance={balance}
                    toggleSidebar={toggleSidebar}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    {visibleNotification && <NotificationModal notification={visibleNotification} onClose={handleCloseNotification} />}
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/consultation-history" element={<ConsultationHistory />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                        <Route path="/financial-history" element={<FinancialHistory />} />
                        <Route path="/credit-recharge" element={<CreditRecharge />} />
                        <Route path="/terms-of-use" element={<TermsOfUse />} />
                        {userRole === 'admin' && (
                            <Route 
                                path="/admin" 
                                element={<Admin notifications={notifications} setNotifications={setNotifications} users={users} setUsers={setUsers} />} 
                            />
                        )}
                        <Route path="/api-docs" element={<ApiDocs />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default App;