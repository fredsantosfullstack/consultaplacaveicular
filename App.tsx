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
import toast from 'react-hot-toast'; // Import toast
import ToastProvider from './src/components/ToastProvider'; // Import ToastProvider
import NotificationToast from './src/components/NotificationToast'; // Import NotificationToast

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

    // State to keep track of currently displayed notification toasts by their ID
    const [activeNotificationToasts, setActiveNotificationToasts] = useState<Record<string, string>>({}); // { notificationId: toastId }

    const [users, setUsers] = useState<User[]>(initialUsers);

    useEffect(() => {
        localStorage.setItem('appNotifications', JSON.stringify(notifications));
    }, [notifications]);

    const handleDismissNotification = (notificationId: string, toastId: string) => {
        const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '{}');
        dismissedNotifications[notificationId] = new Date().getTime();
        localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
        toast.dismiss(toastId);
        setActiveNotificationToasts(prev => {
            const newState = { ...prev };
            delete newState[notificationId];
            return newState;
        });
    };

    useEffect(() => {
        if (userRole === 'user') {
            const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '{}');
            
            notifications.forEach(n => {
                if (n.status !== 'active' || activeNotificationToasts[n.id]) {
                    return; // Not active, or already shown
                }
                
                const lastDismissedTime = dismissedNotifications[n.id];
                const now = new Date().getTime();
                let shouldShow = false;

                if (!lastDismissedTime) {
                    shouldShow = true; // Never dismissed, show it
                } else {
                    // If dismissed, check frequency
                    switch (n.frequency) {
                        case 'hourly':
                            shouldShow = now - lastDismissedTime > 3600000;
                            break;
                        case 'daily':
                            shouldShow = now - lastDismissedTime > 86400000;
                            break;
                        case 'once':
                        default:
                            shouldShow = false; // Dismissed once, never show again
                            break;
                    }
                }

                if (shouldShow) {
                    const newToastId = toast.custom((t) => (
                        <NotificationToast
                            notification={n}
                            toastId={t.id}
                            onClose={() => handleDismissNotification(n.id, t.id)}
                        />
                    ), {
                        id: n.id, // Use notification ID as toast ID for easier management
                        duration: Infinity, // Keep open until dismissed
                    });
                    setActiveNotificationToasts(prev => ({ ...prev, [n.id]: newToastId }));
                }
            });
        } else {
            // If user is admin, dismiss all active notification toasts
            Object.values(activeNotificationToasts).forEach(toastId => toast.dismiss(toastId));
            setActiveNotificationToasts({});
        }
    }, [notifications, userRole, activeNotificationToasts]);

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
                    <ToastProvider /> {/* Add ToastProvider here */}
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