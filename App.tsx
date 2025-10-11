import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import UserLayout from './src/layouts/UserLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import UserProfile from './pages/UserProfile';
import ConsultationHistory from './pages/ConsultationHistory';
import MyOrders from './pages/MyOrders';
import PriceTable from './pages/PriceTable';
import CreditRecharge from './pages/CreditRecharge';
import ApiDocs from './pages/ApiDocs';
import TermsOfUse from './pages/TermsOfUse';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LoadingSpinner from './src/components/LoadingSpinner';

// Componente para proteger rotas que exigem autenticação e aplicar layout global
const ProtectedRoute = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
};

// Componente para proteger rotas que exigem papel de 'admin'
const AdminRoute = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastre-se" element={<SignUp />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/resetar-senha" element={<ResetPassword />} />
        <Route path="/termos-de-uso" element={<TermsOfUse />} />

        {/* Rotas Protegidas para Usuários Logados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/historico-consultas" element={<ConsultationHistory />} />
          <Route path="/meus-pedidos" element={<MyOrders />} />
          <Route path="/tabela-precos" element={<PriceTable />} />
          <Route path="/recarga-creditos" element={<CreditRecharge />} />
          <Route path="/docs-api" element={<ApiDocs />} />

          {/* Rotas Protegidas para Admins (aninhadas) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>

        {/* Redirecionamento Padrão */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
