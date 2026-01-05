import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import AdminPage from '../pages/Admin';
import PriceTable from '../pages/PriceTable';
import RechargePage from '../pages/RechargePage';
import ConsultationPage from '../pages/ConsultationPage';
import ProfilePage from '../pages/ProfilePage';
import ConsultationHistoryPage from '../pages/ConsultationHistoryPage';
import TermsOfUse from '../pages/TermsOfUse';
import LGPDPage from '../pages/LGPD';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas de Consulta
import BaseNacional from './pages/consultas/BaseNacional';
import BaseEstadual from './pages/consultas/BaseEstadual';
import CodigoSegurancaPDF from './pages/consultas/CodigoSegurancaPDF';
import AnoLicenciamento from './pages/consultas/AnoLicenciamento';
import ConsultaCautelar from './pages/consultas/ConsultaCautelar';
import ConsultaChassi from './pages/consultas/ConsultaChassi';
import ConsultaComunicadoVenda from './pages/consultas/ConsultaComunicadoVenda';
import ConsultaLeilao from './pages/consultas/ConsultaLeilao';
import CrlvETurbo from './pages/consultas/CrlvETurbo';
import GravameV2 from './pages/consultas/GravameV2';

function App() {
  return (
    <AuthProvider>
      <Routes>
          {/* Landing Page - Página Inicial Pública */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/cadastro" element={<AuthPage />} />
          <Route path="/cadastre-se" element={<AuthPage />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />
          <Route path="/resetar-senha" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tabela-de-precos"
            element={(
              <ProtectedRoute>
                <PriceTable />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/recarga-creditos"
            element={(
              <ProtectedRoute>
                <RechargePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consultas/:slug"
            element={(
              <ProtectedRoute>
                <ConsultationPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/perfil"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/historico-consultas"
            element={(
              <ProtectedRoute>
                <ConsultationHistoryPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/termos-de-uso" element={<TermsOfUse />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/lgpd" element={<LGPDPage />} />

          {/* Rotas de Consultas Específicas */}
          <Route
            path="/consulta/base-nacional"
            element={(
              <ProtectedRoute>
                <BaseNacional />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/base-estadual"
            element={(
              <ProtectedRoute>
                <BaseEstadual />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/codigo-seguranca-pdf"
            element={(
              <ProtectedRoute>
                <CodigoSegurancaPDF />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/ano-licenciamento-bin-nacional"
            element={(
              <ProtectedRoute>
                <AnoLicenciamento />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/consulta-cautelar"
            element={(
              <ProtectedRoute>
                <ConsultaCautelar />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/consulta-chassi"
            element={(
              <ProtectedRoute>
                <ConsultaChassi />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/consulta-comunicado-venda"
            element={(
              <ProtectedRoute>
                <ConsultaComunicadoVenda />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/consulta-leilao"
            element={(
              <ProtectedRoute>
                <ConsultaLeilao />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/crlv-e-turbo"
            element={(
              <ProtectedRoute>
                <CrlvETurbo />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/consulta/gravame-v2"
            element={(
              <ProtectedRoute>
                <GravameV2 />
              </ProtectedRoute>
            )}
          />
        </Routes>
    </AuthProvider>
  );
}

export default App;
