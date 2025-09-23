import React from 'react';
import { Page } from '../types';
import { 
    FaWhatsapp,
    FaShieldAlt,
    FaFilePdf,
    FaTachometerAlt,
    FaCalendarAlt,
    FaSearch,
    FaCalendarCheck,
    FaSitemap,
    FaMapMarkerAlt,
    FaGlobeAmericas,
    FaBullhorn,
    FaUserShield,
    FaUserTag,
    FaGavel,
    FaCogs,
    FaFileAlt,
    FaLock,
    FaCheckCircle 
} from 'react-icons/fa';

interface DashboardProps {
  setCurrentPage: (page: Page) => void;
  onSelectConsultation: (type: string) => void;
}

const consultations = [
    { title: "N° CRLV + Código de segurança", fields: ["Placa"], description: "Consulta CRV", icon: FaShieldAlt, type: "crv-codigo-seguranca" },
    { title: "Código de segurança PDF Atualizado", fields: ["Placa"], description: "Através da placa Retorna CRV DIGITAL .", icon: FaFilePdf, type: "codigo-seguranca-pdf" },
    { title: "CRLV-E TURBO", isNew: true, description: "Disponível para os seguintes estados: MG, TO, MT, AP, MA, SP, GO, RR, PI, PR, SE, AC, PE", icon: FaTachometerAlt, type: "crlv-e-turbo" },
    { title: "CRLV-E AGENDADO", isNew: true, description: "Disponível para os seguintes estados: PI, RO, AC, DF, SC, RJ, DF, AL, PB, PE, ES, CE, MS .", icon: FaCalendarAlt, type: "crlv-e-agendado" },
    { title: "Consulta Cautelar", isNew: true, description: "BIN ESTADUAL, PROPRIETARIO ATUAL, LEILAO SIMPLES + LEILAO COMPLETAO COM SCORE, CSV INMETRO + RENAINF SIMPLES + RESTRIÇÕES ESTADUAL, PROPRIETÁRIO ATUAL LEILÃO SIMPLES + LEILÃO COMPLETAO COM SCORE, CSV INMETRO + RENAINF SIMPLES + RESTRIÇÕES", icon: FaSearch, type: "consulta-cautelar" },
    { title: "Ano Licenciamento + Bin Nacional", isNew: true, fields: ["Placa."], description: "", icon: FaCalendarCheck, type: "ano-licenciamento" },
    { title: "CSV -RENAINF - RENAJUD - RECALL - BIN - PROPRIETAR", isNew: true, fields: ["Placa"], description: "", icon: FaSitemap, type: "csv-renainf" },
    { title: "Base Estadual", isNew: true, description: "Exibe os dados do veículo registrados no estado, incluindo débitos de licenciamento, IPVA, multas e restrições (administrativas, financeiras, judiciais, tributárias, roubo/furto), gravame, emplacamento e chassi.", icon: FaMapMarkerAlt, type: "base-estadual" },
    { title: "Base Nacional", isNew: true, description: "(Base de Índice Nacional) é uma base oficial do DENATRAN que reúne as principais informações do veículo, como dados cadastrais, restrições (administrativas, financeiras, judiciais, tributárias e roubo/furto), emplacamento e identificador de chassi.", icon: FaGlobeAmericas, type: "base-nacional" },
    { title: "Consulta Comunicado De Venda", description: "Consulta Informações do Comunicado De Venda.", icon: FaBullhorn, type: "comunicado-venda" },
    { title: "Proprietário Atual + Restrições", fields: ["Placa"], description: "Informa o proprietário atual do veículo.", icon: FaUserShield, type: "proprietario-restricoes" },
    { title: "Proprietário Atual V2", isNew: true, fields: ["Placa"], description: "Informa o proprietário atual do veículo.", icon: FaUserTag, type: "proprietario-v2" },
    { title: "Consulta Leilão", isNew: true, fields: ["Placa"], description: "", icon: FaGavel, type: "consulta-leilao" },
    { title: "Consulta Chassi", description: "Através do Chassi/Motor, você pode obter informações sobre o veículo.", icon: FaCogs, type: "consulta-chassi" },
    { title: "Reemissão ATPV-E", fields: ["chassi"], description: "Através do chassi, retorna ATPV! Não pode ter comunicado de venda.", icon: FaFileAlt, type: "reemissao-atpv-e" },
    { title: "Gravame V2", isNew: true, fields: ["Placa"], description: "Através da placa, você pode verificar se há algum gravame registrado no veículo.", icon: FaLock, type: "gravame-v2" },
    { title: "Verifica autenticidade CRV", description: "Verifique se o CRV é válido Gratis.", icon: FaCheckCircle, type: "verifica-crv" },
];

const ConsultationCard: React.FC<{
    title: string;
    isNew?: boolean;
    fields?: string[];
    description?: string;
    icon: React.ElementType;
    onConsult: () => void;
}> = ({ title, isNew, fields, description, icon: Icon, onConsult }) => (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow space-y-3 flex flex-col">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <h3 className="font-bold text-gray-800">{title}</h3>
                </div>
                {isNew && <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">NOVO</span>}
            </div>
            
            <div className="flex-grow space-y-2">
                {fields && (
                    <div className="space-y-1">
                        {fields.map((field, index) => (
                            <p key={index} className="text-gray-500 text-sm">{field}</p>
                        ))}
                    </div>
                )}
                {description && <p className="text-gray-600 text-sm">{description}</p>}
            </div>
        </div>
        <div className="pt-4">
             <button onClick={onConsult} className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">Consultar</button>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage, onSelectConsultation }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {consultations.map((consult) => <ConsultationCard key={consult.type} {...consult} onConsult={() => onSelectConsultation(consult.type)} />)}
        </div>
    </div>
  );
};

export default Dashboard;