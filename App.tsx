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
import Footer from './src/components/Footer';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ToastProvider from './src/components/ToastProvider';
import NotificationToast from './src/components/NotificationToast';
import PriceTable from './pages/PriceTable';

// Mock user data
const initialUsers: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@goldenveicular.com.br', role: 'admin', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=admin@example.com' },
    { id: '2', name: 'Fredson Luz', email: 'fredson@example.com', role: 'user', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=fredson@example.com' },
    { id: '3', name: 'Maria Souza', email: 'maria.s@example.com', role: 'user', status: 'inactive', avatarUrl: 'https://i.pravatar.cc/150?u=maria.s@example.com' },
    { id: '4', name: 'Carlos Pereira', email: 'carlos.p@example.com', role: 'user', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=carlos.p@example.com' },
];

// Mock price data
const initialPriceData = [
  { id: '1', name: 'Base Estadual', price: 5.00 },
  { id: '2', name: 'Base Nacional', price: 5.00 },
  { id: '3', name: 'Consulta ATPV-E', price: 30.00 },
  { id: '4', name: 'Consulta Cautelar', price: 29.90 },
  { id: '5', name: 'Consulta Comunicado de Venda', price: 5.00 },
  { id: '6', name: 'Consulta Gravame', price: 5.00 },
  { id: '7', name: 'Consulta Leilão Simples', price: 9.99 },
  { id: '8', name: 'Consulta Rápida por Chassi', price: 3.00 },
  { id: '9', name: 'Consulta Rápida por Placa', price: 3.00 },
  { id: '10', name: 'Consulta Renajud', price: 7.00 },
  { id: '11', name: 'CRLV-E AC', price: 24.90 },
  { id: '12', name: 'CRLV-E AP', price: 7.00 },
  { id: '13', name: 'CRLV-E BA', price: 25.00 },
  { id: '14', name: 'CRLV-E GO', price: 14.90 },
  { id: '15', name: 'CRLV-E MA', price: 7.00 },
  { id: '16', name: 'CRLV-E MG', price: 10.00 },
  { id: '17', name: 'CRLV-E MT', price: 7.00 },
  { id: '18', name: 'CRLV-E PE', price: 24.90 },
  { id: '19', name: 'CRLV-E PI', price: 25.00 },
  { id: '20', name: 'CRLV-E PR', price: 10.00 },
  { id: '21', name: 'CRLV-E RO', price: 19.90 },
  { id: '22', name: 'CRLV-E RR', price: 20.00 },
  { id: '23', name: 'CRLV-E SE', price: 20.00 },
  { id: '24', name: 'CRLV-E SP', price: 10.00 },
  { id: '25', name: 'CRLV-E TO', price: 7.00 },
  { id: '26', name: 'CRV Digital (PDF)', price: 9.99 },
  { id: '27', name: 'Licenciamento + BIN Nacional', price: 5.00 },
  { id: '28', name: 'N° CRV + Código de segurança', price: 9.99 },
  { id: '29', name: 'Validação CRV', price: 0.00 },
];


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [balance, setBalance] = useState(123.45);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
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

    const [activeNotificationToasts, setActiveNotificationToasts] = useState<Record<string, string>>({});

    const [users, setUsers] = useState<User[]>(() => {
        try {
            const saved = localStorage.getItem('appUsers');
            return saved ? JSON.parse(saved) : initialUsers;
        } catch (error) {
            console.error("Failed to parse users from localStorage", error);
            return initialUsers;
        }
    });

    const [priceList, setPriceList] = useState(() => {
        try {
            const saved = localStorage.getItem('appPriceList');
            return saved ? JSON.parse(saved) : initialPriceData;
        } catch (error) {
            console.error("Failed to parse price list from localStorage", error);
            return initialPriceData;
        }
    });

    useEffect(() => {
        localStorage.setItem('appUsers', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('appPriceList', JSON.stringify(priceList));
    }, [priceList]);

    useEffect(() => {
        const savedLogo = localStorage.getItem('customLogo');
        const savedFavicon = localStorage.getItem('customFavicon');
        if (savedLogo) setLogoUrl(savedLogo);
        if (savedFavicon) setFaviconUrl(savedFavicon);
    }, []);

    useEffect(() => {
        if (faviconUrl) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = faviconUrl;
        }
    }, [faviconUrl]);

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
                    return;
                }
                
                const lastDismissedTime = dismissedNotifications[n.id];
                const now = new Date().getTime();
                let shouldShow = false;

                if (!lastDismissedTime) {
                    shouldShow = true;
                } else {
                    switch (n.frequency) {
                        case 'hourly':
                            shouldShow = now - lastDismissedTime > 3600000; // 1 hour
                            break;
                        case 'daily':
                            shouldShow = now - lastDismissedTime > 86400000; // 24 hours
                            break;
                        case 'monthly':
                            shouldShow = now - lastDismissedTime > 2592000000; // 30 days
                            break;
                        case 'yearly':
                            shouldShow = now - lastDismissedTime > 31536000000; // 365 days
                            break;
                        case 'once':
                        default:
                            shouldShow = false;
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
                        id: n.id,
                        duration: Infinity,
                    });
                    setActiveNotificationToasts(prev => ({ ...prev, [n.id]: newToastId }));
                }
            });
        } else {
            Object.values(activeNotificationToasts).forEach(toastId => toast.dismiss(toastId));
            setActiveNotificationToasts({});
        }
    }, [notifications, userRole, activeNotificationToasts]);

    const handleLogin = (name: string) => {
        setIsLoggedIn(true);
        setUsername(name.split('@')[0]);
        const email = name.toLowerCase();
        if (email === 'admin@goldenveicular.com.br' || email === 'admin@app:goldenveicular.com.br') {
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
                logoUrl={logoUrl}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    username={username}
                    balance={balance}
                    toggleSidebar={toggleSidebar}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <ToastProvider />
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard onSelectConsultation={() => {}} />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/consultation-history" element={<ConsultationHistory />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                        <Route path="/financial-history" element={<FinancialHistory />} />
                        <Route path="/credit-recharge" element={<CreditRecharge />} />
                        <Route path="/price-table" element={<PriceTable priceData={priceList} />} />
                        <Route path="/terms-of-use" element={<TermsOfUse />} />
                        {userRole === 'admin' && (
                            <Route 
                                path="/admin" 
                                element={<Admin 
                                    notifications={notifications} 
                                    setNotifications={setNotifications} 
                                    users={users} 
                                    setUsers={setUsers} 
                                    priceList={priceList} 
                                    setPriceList={setPriceList}
                                    setLogoUrl={setLogoUrl}
                                    setFaviconUrl={setFaviconUrl}
                                />} 
                            />
                        )}
                        <Route path="/api-docs" element={<ApiDocs />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;