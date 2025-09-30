import React from 'react';
import {
  Home,
  UserCircle,
  History,
  FolderOpen,
  DollarSign,
  CreditCard,
  LogOut,
  BookText,
  UserCog,
  Tags,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CustomLogo from './CustomLogo';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  userRole: 'admin' | 'user';
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
        className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
      >
        <Icon className="w-5 h-5 mr-3 text-gray-400" />
        <span className="font-medium text-sm">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, userRole }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={toggle}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative`}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
            <CustomLogo 
                type="menu" 
                className="w-[150px] h-auto"
                fallbackClassName="w-[150px] h-auto"
            />
        </div>
        
        <nav className="mt-4 flex-1 px-4">
          <ul className="space-y-2">
            <NavItem icon={Home} label="Início" to="/dashboard" onClick={toggle} />
            <NavItem icon={UserCircle} label="Meu Perfil" to="/perfil" onClick={toggle} />
            <NavItem icon={History} label="Histórico" to="/historico-consultas" onClick={toggle} />
            <NavItem icon={FolderOpen} label="Meus Pedidos" to="/meus-pedidos" onClick={toggle} />
            <NavItem icon={CreditCard} label="Recarregar" to="/recarga-creditos" onClick={toggle} />
            <NavItem icon={Tags} label="Tabela de Preços" to="/tabela-precos" onClick={toggle} />
            <NavItem icon={BookText} label="Documentação API" to="/docs-api" onClick={toggle} />
          </ul>
        </nav>

        <div className="px-4 pb-4">
          <ul className="space-y-2 border-t border-gray-700 pt-4">
            {userRole === 'admin' && (
                <NavItem icon={UserCog} label="Painel Admin" to="/admin" onClick={toggle} />
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
