import React from 'react';
import {
  Home,
  History,
  FolderOpen,
  DollarSign,
  CreditCard,
  UserCircle,
  LogOut,
  BookText,
  UserCog,
  Tags,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { GoldenVeicularLogoWhite } from './Icons';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: 'user' | 'admin';
  handleLogout: () => void;
  logoUrl: string | null;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center p-3 rounded-lg text-gray-300 hover:bg-[#001a4d] hover:text-white transition-colors duration-200 ${
          isActive ? 'bg-[#002672] text-white' : ''
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium text-sm">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar, userRole, handleLogout, logoUrl }) => {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 p-4 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}
      >
        <div className="flex items-center justify-center h-20">
            {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
            ) : (
                <GoldenVeicularLogoWhite className="w-auto h-16" />
            )}
        </div>
        
        <nav className="mt-4 flex-1">
          <ul className="space-y-2">
            <NavItem icon={Home} label="Início" to="/dashboard" onClick={toggleSidebar} />
            <NavItem icon={UserCircle} label="Meu Perfil" to="/profile" onClick={toggleSidebar} />
            <NavItem icon={History} label="Histórico de Consultas" to="/consultation-history" onClick={toggleSidebar} />
            <NavItem icon={FolderOpen} label="Pedidos CRLV-E" to="/my-orders" onClick={toggleSidebar} />
            <NavItem icon={DollarSign} label="Financeiro" to="/financial-history" onClick={toggleSidebar} />
            <NavItem icon={CreditCard} label="Recarga de Crédito" to="/credit-recharge" onClick={toggleSidebar} />
            <NavItem icon={Tags} label="Tabela de Valores" to="/price-table" onClick={toggleSidebar} />
            <NavItem icon={BookText} label="Termos de Uso" to="/terms-of-use" onClick={toggleSidebar} />
          </ul>
        </nav>
        <div className="mt-auto">
          <ul className="space-y-2">
            {userRole === 'admin' && (
                <NavItem icon={UserCog} label="Painel Admin" to="/admin" onClick={toggleSidebar} />
            )}
            <NavItem icon={LogOut} label="Sair" to="/login" onClick={() => { handleLogout(); toggleSidebar(); }} />
          </ul>
        </div>
      </aside>
       {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
    </>
  );
};

export default Sidebar;