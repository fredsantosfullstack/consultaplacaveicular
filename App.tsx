// Fix: Implemented the main App component to manage state and navigation.
import React, { useState, useEffect } from 'react';
import { Page, Notification, User } from './types';
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
    { id: '1', name: 'Admin User', email: 'admin@portaldospachantes.com.br', role: 'admin', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=admin@portaldospachantes.com.br' },
    { id: '2', name: 'Fredson Luz', email: 'fredson@example.com', role: 'user', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=fredson@example.com' },
    { id: '3', name: 'Maria Souza', email: 'maria.s@example.com', role: 'user', status: 'inactive', avatarUrl: 'https://i.pravatar.cc/150?u=maria.s@example.com' },
    { id: '4', name: 'Carlos Pereira', email: 'carlos.p@example.com', role: 'user', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=carlos.p@example.com' },
];


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState<'user' | 'admin'>('user'); // Default to 'user'
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [balance, setBalance] = useState(123.45); // Dummy balance
    
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
    }, [notifications, currentPage, userRole]);

    const handleLogin = (name: string) => {
        setIsLoggedIn(true);
        setUsername(name.split('@')[0]); // Use part of email as name
        // Simple logic to set admin role for demonstration
        if (name.toLowerCase() === 'admin@portaldospachantes.com.br') {
            setUserRole('admin');
        } else {
            setUserRole('user');
        }
        setCurrentPage(Page.Dashboard);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setCurrentPage(Page.Login);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSetCurrentPage = (page: Page) => {
        if (page === Page.Logout) {
            handleLogout();
        } else {
            setCurrentPage(page);
        }
        if (window.innerWidth < 768) { // md breakpoint in tailwind
          setIsSidebarOpen(false);
        }
    };

    const handleSelectConsultation = (type: string) => {
        console.log('Selected consultation type:', type);
        // For demonstration, some consultations could navigate to ApiDocs
        setCurrentPage(Page.ApiDocs);
    };

    const handleCloseNotification = () => {
        if (visibleNotification) {
            const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '{}');
            dismissedNotifications[visibleNotification.id] = new Date().getTime();
            localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
            setVisibleNotification(null);
        }
    };


    const renderPage = () => {
        switch (currentPage) {
            case Page.Dashboard:
                return <Dashboard setCurrentPage={handleSetCurrentPage} onSelectConsultation={handleSelectConsultation} />;
            case Page.Profile:
                return <UserProfile setCurrentPage={handleSetCurrentPage} />;
            case Page.ConsultationHistory:
                return <ConsultationHistory setCurrentPage={handleSetCurrentPage} />;
            case Page.CRLVOrders:
                return <MyOrders setCurrentPage={handleSetCurrentPage} />;
            case Page.Financial:
                return <FinancialHistory setCurrentPage={handleSetCurrentPage} />;
            case Page.CreditRecharge:
                return <CreditRecharge setCurrentPage={handleSetCurrentPage} />;
            case Page.TermsOfUse:
                return <TermsOfUse setCurrentPage={handleSetCurrentPage} />;
            case Page.AdminPanel:
                return userRole === 'admin' ? <Admin setCurrentPage={handleSetCurrentPage} notifications={notifications} setNotifications={setNotifications} users={users} setUsers={setUsers} /> : <Dashboard setCurrentPage={handleSetCurrentPage} onSelectConsultation={handleSelectConsultation} />;
            case Page.ApiDocs:
                return <ApiDocs setCurrentPage={handleSetCurrentPage} />;
            default:
                return <Dashboard setCurrentPage={handleSetCurrentPage} onSelectConsultation={handleSelectConsultation} />;
        }
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                currentPage={currentPage} 
                setCurrentPage={handleSetCurrentPage}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                userRole={userRole}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    username={username}
                    balance={balance}
                    setCurrentPage={handleSetCurrentPage}
                    toggleSidebar={toggleSidebar}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    {visibleNotification && <NotificationModal notification={visibleNotification} onClose={handleCloseNotification} />}
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;