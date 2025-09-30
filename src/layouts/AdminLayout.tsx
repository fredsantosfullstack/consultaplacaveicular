import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

// Lazy load da página principal do Admin
const AdminPage = lazy(() => import('../../pages/Admin'));

const AdminHeader: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
            <div>
                <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user?.name || 'Admin'}</p>
            </div>
            <button 
                onClick={logout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors font-medium"
            >
                <LogOut className="w-5 h-5"/>
                <span>Sair</span>
            </button>
        </header>
    );
};

const AdminLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <AdminHeader />
            <main className="flex-grow p-4 sm:p-6 lg:p-8">
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <Routes>
                        <Route path="/dashboard" element={<AdminPage />} />
                        {/* Outras rotas de admin podem ser adicionadas aqui */}
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

export default AdminLayout;
