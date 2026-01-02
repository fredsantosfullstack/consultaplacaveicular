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
  FileText,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CustomLogo from './CustomLogo';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  userRole: 'admin' | 'user';
  onLogout: () => void;
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
        <Icon className="w-5 h-5 mr-3 text-white" />
        <span className="font-medium text-sm">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, userRole, onLogout }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={toggle}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-[#076AC2] text-white z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative`}
      >
        <div className="pt-6 pb-4 px-4">
          <div className="border-b border-white/20 pb-4 flex justify-start">
            <CustomLogo type="menu" className="ml-1" />
          </div>
        </div>
        
        <nav className="mt-8 flex-1 px-4">
          <ul className="space-y-4">
            <NavItem icon={UserCircle} label="Meu Perfil" to="/perfil" onClick={toggle} />
            <NavItem icon={Home} label="Início" to="/dashboard" onClick={toggle} />
            <NavItem icon={History} label="Histórico" to="/historico-consultas" onClick={toggle} />
            <NavItem icon={FolderOpen} label="Meus Pedidos" to="/meus-pedidos" onClick={toggle} />
            <NavItem icon={CreditCard} label="Recarregar" to="/recarga-creditos" onClick={toggle} />
            <NavItem icon={Tags} label="Tabela de Preços" to="/tabela-precos" onClick={toggle} />
          </ul>
        </nav>

        <div className="px-4 pb-4 absolute bottom-0 w-full">
          <ul className="space-y-2 border-t border-white/20 pt-4">
            {userRole === 'admin' && (
                <NavItem 
                icon={UserCog} 
                label="Painel Admin" 
                to="/admin" 
                onClick={() => {
                  // Dispara um evento customizado que a página Admin pode escutar
                  window.dispatchEvent(new CustomEvent('admin-gohome'));
                  toggle();
                }}
              />
            )}
            <NavItem icon={FileText} label="Termos de Uso" to="/termos-de-uso" onClick={toggle} />
            <li>
              <button 
                onClick={() => { onLogout(); toggle(); }}
                className="w-full flex items-center px-4 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3 text-white" />
                <span className="font-medium text-sm">Sair</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
