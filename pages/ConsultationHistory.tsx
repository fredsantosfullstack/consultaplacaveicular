import React from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConsultationHistoryProps {
  // setCurrentPage: (page: Page) => void; // Removed
}

const FilterInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col flex-grow min-w-[150px]">
        <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

const ConsultationHistory: React.FC<ConsultationHistoryProps> = () => { // Removed setCurrentPage from props
    const navigate = useNavigate();
    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <h1 className="text-center text-3xl font-bold text-gray-800">Histórico de Consultas</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center flex-wrap gap-4">
                <FilterInput label="Tipo de Consulta">
                    <select className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#0f43aa] focus:outline-none focus:ring-2 focus:ring-[#0f43aa]/20 transition-colors duration-200">
                        <option>Todos</option>
                    </select>
                </FilterInput>
                 <FilterInput label="Data Inicial">
                    <div className="relative">
                        <input 
                          type="text"
                          placeholder="dd/mm/aaaa"
                          onFocus={(e) => (e.target.type = 'date')}
                          onBlur={(e) => (e.target.type = 'text')}
                          className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#0f43aa] focus:outline-none focus:ring-2 focus:ring-[#0f43aa]/20 transition-colors duration-200" 
                        />
                         <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
                    </div>
                </FilterInput>
                 <FilterInput label="Data Final">
                    <div className="relative">
                        <input 
                          type="text"
                          placeholder="dd/mm/aaaa"
                          onFocus={(e) => (e.target.type = 'date')}
                          onBlur={(e) => (e.target.type = 'text')}
                          className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#0f43aa] focus:outline-none focus:ring-2 focus:ring-[#0f43aa]/20 transition-colors duration-200" 
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
                    </div>
                </FilterInput>
                 <FilterInput label="Mostrar">
                    <select className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#0f43aa] focus:outline-none focus:ring-2 focus:ring-[#0f43aa]/20 transition-colors duration-200">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </FilterInput>
            </div>

            <div className="rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 text-sm font-semibold text-white bg-gray-800">
                    <div className="p-3">Placa</div>
                    <div className="p-3">Tipo de Consulta</div>
                    <div className="p-3">Data da Consulta</div>
                    <div className="p-3">Status da Consulta</div>
                    <div className="p-3">Fonte</div>
                    <div className="p-3">Ações</div>
                </div>
                <div className="bg-white">
                    <div className="text-center py-16 text-gray-500">Nenhuma consulta registrada.</div>
                </div>
            </div>

             <div className="text-center pt-4">
                <button onClick={() => navigate('/dashboard')} className="bg-[#0f43aa] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#0c3688] transition-opacity">
                    Voltar
                </button>
             </div>
        </div>
    );
};

export default ConsultationHistory;