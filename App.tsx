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
import PublicPriceTable from './pages/PublicPriceTable';
import CreditRecharge from './pages/CreditRecharge';
import ApiDocs from './pages/ApiDocs';
import TermsOfUse from './pages/TermsOfUse';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LoadingSpinner from './src/components/LoadingSpinner';
import BaseNacional from './src/pages/consultas/BaseNacional';
import BaseEstadual from './src/pages/consultas/BaseEstadual';
import CodigoSegurancaPDF from './src/pages/consultas/CodigoSegurancaPDF';
import AnoLicenciamento from './src/pages/consultas/AnoLicenciamento';
import ConsultaCautelar from './src/pages/consultas/ConsultaCautelar';
import ConsultaChassi from './src/pages/consultas/ConsultaChassi';
import ConsultaComunicadoVenda from './src/pages/consultas/ConsultaComunicadoVenda';
import ConsultaLeilao from './src/pages/consultas/ConsultaLeilao';
import CrlvETurbo from './src/pages/consultas/CrlvETurbo';
import GravameV2 from './src/pages/consultas/GravameV2';
import ProprietarioAtualV2 from './src/pages/consultas/ProprietarioAtualV2';
import CsvRenainfRenajud from './src/pages/consultas/CsvRenainfRenajud';
import EmissaoCrlvE from './src/pages/consultas/EmissaoCrlvE';

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
        <Route path="/tabela-precos-publica" element={<PublicPriceTable />} />

        {/* Rotas Protegidas para Usuários Logados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/historico-consultas" element={<ConsultationHistory />} />
          <Route path="/meus-pedidos" element={<MyOrders />} />
          <Route path="/tabela-precos" element={<PriceTable />} />
          <Route path="/recarga-creditos" element={<CreditRecharge />} />
          <Route path="/docs-api" element={<ApiDocs />} />
          <Route path="/termos-de-uso" element={<TermsOfUse />} />

          {/* Consultas */}
          <Route path="/consulta/base-nacional" element={<BaseNacional />} />
          <Route path="/consulta/base-estadual" element={<BaseEstadual />} />
          <Route path="/consulta/codigo-seguranca-pdf" element={<CodigoSegurancaPDF />} />
          <Route path="/consulta/ano-licenciamento-bin-nacional" element={<AnoLicenciamento />} />
          <Route path="/consulta/consulta-cautelar" element={<ConsultaCautelar />} />
          <Route path="/consulta/consulta-chassi" element={<ConsultaChassi />} />
          <Route path="/consulta/consulta-comunicado-venda" element={<ConsultaComunicadoVenda />} />
          <Route path="/consulta/consulta-leilao" element={<ConsultaLeilao />} />
          <Route path="/consulta/crlv-e-turbo" element={<CrlvETurbo />} />
          <Route path="/consulta/gravame-v2" element={<GravameV2 />} />
          <Route path="/consulta/proprietario-atual-v2" element={<ProprietarioAtualV2 />} />
          <Route path="/consulta/csv-renainf-renajud-recall-bin-proprietar" element={<CsvRenainfRenajud />} />
          <Route path="/consulta/crlve" element={<EmissaoCrlvE />} />

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
