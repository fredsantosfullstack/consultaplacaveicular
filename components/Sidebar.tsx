import React from 'react';
import {
  FaHome,
  FaHistory,
  FaFolderOpen,
  FaDollarSign,
  FaCreditCard,
  FaUserCircle,
  FaSignOutAlt,
  FaBook,
  FaUserShield,
  FaTags,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: 'user' | 'admin';
  handleLogout: () => void;
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
        className={`flex items-center p-3 rounded-lg text-gray-200 hover:bg-white/10 transition-colors duration-200 ${
          isActive ? 'bg-white/20 text-white' : ''
        }`}
      >
        <Icon className="w-6 h-6 mr-3" />
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar, userRole, handleLogout }) => {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 bg-[#007BFF] text-white w-64 p-4 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}
      >
        <div className="flex items-center justify-center h-20">
            <span className="text-2xl font-bold text-white">Golden Veicular</span>
        </div>
        
        <hr className="border-t border-white/20 my-2" />

        <nav className="mt-4 flex-1">
          <ul className="space-y-2">
            <NavItem icon={FaHome} label="Início" to="/dashboard" onClick={toggleSidebar} />
            <NavItem icon={FaUserCircle} label="Meu Perfil" to="/profile" onClick={toggleSidebar} />
            <NavItem icon={FaHistory} label="Histórico de Consultas" to="/consultation-history" onClick={toggleSidebar} />
            <NavItem icon={FaFolderOpen} label="Pedidos CRLV-E" to="/my-orders" onClick={toggleSidebar} />
            <NavItem icon={FaDollarSign} label="Financeiro" to="/financial-history" onClick={toggleSidebar} />
            <NavItem icon={FaCreditCard} label="Recarga de Crédito" to="/credit-recharge" onClick={toggleSidebar} />
            <NavItem icon={FaTags} label="Tabela de Valores" to="/price-table" onClick={toggleSidebar} />
            <NavItem icon={FaBook} label="Termos de Uso" to="/terms-of-use" onClick={toggleSidebar} />
          </ul>
        </nav>
        <div className="mt-auto">
          <ul className="space-y-2">
            {userRole === 'admin' && (
                <NavItem icon={FaUserShield} label="Painel Admin" to="/admin" onClick={toggleSidebar} />
            )}
            <NavItem icon={FaSignOutAlt} label="Sair" to="/login" onClick={() => { handleLogout(); toggleSidebar(); }} />
          </ul>
        </div>
      </aside>
       {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
    </>
  );
};

export default Sidebar;