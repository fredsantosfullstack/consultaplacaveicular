import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';

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
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/cadastre-se" element={<AuthPage />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />
          <Route path="/resetar-senha" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/tabela-de-precos" element={<PriceTable />} />
          <Route path="/recarga-creditos" element={<RechargePage />} />
          <Route path="/consultas/:slug" element={<ConsultationPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/historico-consultas" element={<ConsultationHistoryPage />} />
          
          {/* Rotas de Consultas Específicas */}
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
          
          <Route path="/" element={<AuthPage />} /> {/* Rota padrão */} 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
