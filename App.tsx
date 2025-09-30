import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import ToastProvider from './src/components/ToastProvider';
import LoadingSpinner from './src/components/LoadingSpinner';

// Lazy load das páginas
const LoginPage = lazy(() => import('./pages/Login'));
const SignUpPage = lazy(() => import('./pages/SignUp'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const UserLayout = lazy(() => import('./src/layouts/UserLayout'));
const AdminLayout = lazy(() => import('./src/layouts/AdminLayout'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUse'));

// Componente de Roteamento Principal
const AppRoutes: React.FC = () => {
    const { user, isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cadastre-se" element={<SignUpPage />} />
                <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
                <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
                <Route path="/termos-de-uso" element={<TermsOfUsePage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    // Se autenticado, redirecionar baseado na role
    if (user?.role === 'admin') {
        return (
            <Routes>
                <Route path="/admin/*" element={<AdminLayout />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/*" element={<UserLayout />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ToastProvider />
            <Suspense fallback={<LoadingSpinner fullScreen />}>
                <AppRoutes />
            </Suspense>
        </AuthProvider>
    );
};

export default App;
