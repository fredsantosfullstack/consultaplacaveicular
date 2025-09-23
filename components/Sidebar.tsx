import React from 'react';
import { Page } from '../types';
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
} from 'react-icons/fa';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: 'user' | 'admin';
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}> = ({ icon: Icon, label, page, currentPage, setCurrentPage }) => {
  const isActive = currentPage === page;
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage(page);
        }}
        className={`flex items-center p-3 rounded-lg text-gray-200 hover:bg-white/10 transition-colors duration-200 ${
          isActive ? 'bg-white/20 text-white' : ''
        }`}
      >
        <Icon className="w-6 h-6 mr-3" />
        <span className="font-medium">{label}</span>
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isSidebarOpen, toggleSidebar, userRole }) => {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 bg-[#007BFF] text-white w-64 p-4 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}
      >
        <div className="flex items-center justify-center h-20">
            <span className="text-2xl font-bold text-white">PortalDespachantes</span>
        </div>
        
        <hr className="border-t border-white/20 my-2" />

        <nav className="mt-4 flex-1">
          <ul className="space-y-2">
            <NavItem icon={FaHome} label="Início" page={Page.Dashboard} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavItem icon={FaUserCircle} label="Meu Perfil" page={Page.Profile} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavItem icon={FaHistory} label="Histórico de Consultas" page={Page.ConsultationHistory} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavItem icon={FaFolderOpen} label="Pedidos CRLV-E" page={Page.CRLVOrders} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavItem icon={FaDollarSign} label="Financeiro" page={Page.Financial} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavItem icon={FaCreditCard} label="Recarga de Crédito" page={Page.CreditRecharge} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavItem icon={FaBook} label="Termos de Uso" page={Page.TermsOfUse} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </ul>
        </nav>
        <div className="mt-auto">
          <ul className="space-y-2">
            {userRole === 'admin' && (
                <NavItem icon={FaUserShield} label="Painel Admin" page={Page.AdminPanel} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            )}
            <NavItem icon={FaSignOutAlt} label="Sair" page={Page.Logout} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </ul>
        </div>
      </aside>
       {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
    </>
  );
};

export default Sidebar;