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
                    <Route path="/" element={<AuthPage />} /> {/* Rota padrão */} 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
