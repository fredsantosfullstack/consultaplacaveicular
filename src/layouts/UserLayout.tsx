import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/apiService';

// Lazy load das páginas de usuário
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const UserProfile = lazy(() => import('../../pages/UserProfile'));
const ConsultationHistory = lazy(() => import('../../pages/ConsultationHistory'));
const MyOrders = lazy(() => import('../../pages/MyOrders'));
const FinancialHistory = lazy(() => import('../../pages/FinancialHistory'));
const CreditRecharge = lazy(() => import('../../pages/CreditRecharge'));
const PriceTable = lazy(() => import('../../pages/PriceTable'));
const TermsOfUse = lazy(() => import('../../pages/TermsOfUse'));
const ApiDocs = lazy(() => import('../../pages/ApiDocs'));

const UserLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [priceList, setPriceList] = useState<any[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [prices, logos] = await Promise.all([
                    apiService.getPrices(),
                    apiService.getAllLogos()
                ]);

                setPriceList(prices.all_services.map(s => ({ ...s, id: s.id.toString() })));
                setLogoUrl(logos.menu_logo);
            } catch (error) {
                console.error("Erro ao carregar dados iniciais do usuário:", error);
            }
        };

        fetchInitialData();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                userRole={user?.role || 'user'}
                handleLogout={logout}
                logoUrl={logoUrl}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    username={user?.name || ''}
                    balance={user?.balance || 0}
                    toggleSidebar={toggleSidebar}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <Suspense fallback={<LoadingSpinner fullScreen />}>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard onSelectConsultation={() => {}} />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/consultation-history" element={<ConsultationHistory />} />
                            <Route path="/my-orders" element={<MyOrders />} />
                            <Route path="/financial-history" element={<FinancialHistory />} />
                            <Route path="/credit-recharge" element={<CreditRecharge />} />
                            <Route path="/price-table" element={<PriceTable priceData={priceList} />} />
                            <Route path="/terms-of-use" element={<TermsOfUse />} />
                            <Route path="/api-docs" element={<ApiDocs />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default UserLayout;
