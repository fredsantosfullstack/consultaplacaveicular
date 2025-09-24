import React from 'react';
import { 
    MessageCircle,
    Shield,
    FileText,
    Gauge,
    Calendar,
    Search,
    CalendarCheck,
    Network,
    MapPin,
    Globe,
    Megaphone,
    UserCog,
    UserCheck,
    Gavel,
    Settings,
    File,
    Lock,
    CheckCircle 
} from 'lucide-react';

interface DashboardProps {
  onSelectConsultation: (type: string) => void;
}

const consultations = [
    { title: "N° CRLV + Código de segurança", fields: ["Placa"], description: "Consulta CRV", icon: Shield, type: "crv-codigo-seguranca" },
    { title: "Código de segurança PDF Atualizado", fields: ["Placa"], description: "Através da placa Retorna CRV DIGITAL .", icon: FileText, type: "codigo-seguranca-pdf" },
    { title: "CRLV-E TURBO", isNew: true, description: "Disponível para os seguintes estados: MG, TO, MT, AP, MA, SP, GO, RR, PI, PR, SE, AC, PE", icon: Gauge, type: "crlv-e-turbo" },
    { title: "CRLV-E AGENDADO", isNew: true, description: "Disponível para os seguintes estados: PI, RO, AC, DF, SC, RJ, DF, AL, PB, PE, ES, CE, MS .", icon: Calendar, type: "crlv-e-agendado" },
    { title: "Consulta Cautelar", isNew: true, description: "BIN ESTADUAL, PROPRIETARIO ATUAL, LEILAO SIMPLES + LEILAO COMPLETAO COM SCORE, CSV INMETRO + RENAINF SIMPLES + RESTRIÇÕES ESTADUAL, PROPRIETÁRIO ATUAL LEILÃO SIMPLES + LEILÃO COMPLETAO COM SCORE, CSV INMETRO + RENAINF SIMPLES + RESTRIÇÕES", icon: Search, type: "consulta-cautelar" },
    { title: "Ano Licenciamento + Bin Nacional", isNew: true, fields: ["Placa."], description: "", icon: CalendarCheck, type: "ano-licenciamento" },
    { title: "CSV -RENAINF - RENAJUD - RECALL - BIN - PROPRIETAR", isNew: true, fields: ["Placa"], description: "", icon: Network, type: "csv-renainf" },
    { title: "Base Estadual", isNew: true, description: "Exibe os dados do veículo registrados no estado, incluindo débitos de licenciamento, IPVA, multas e restrições (administrativas, financeiras, judiciais, tributárias, roubo/furto), gravame, emplacamento e chassi.", icon: MapPin, type: "base-estadual" },
    { title: "Base Nacional", isNew: true, description: "(Base de Índice Nacional) é uma base oficial do DENATRAN que reúne as principais informações do veículo, como dados cadastrais, restrições (administrativas, financeiras, judiciais, tributárias e roubo/furto), emplacamento e identificador de chassi.", icon: Globe, type: "base-nacional" },
    { title: "Consulta Comunicado De Venda", description: "Consulta Informações do Comunicado De Venda.", icon: Megaphone, type: "comunicado-venda" },
    { title: "Proprietário Atual + Restrições", fields: ["Placa"], description: "Informa o proprietário atual do veículo.", icon: UserCog, type: "proprietario-restricoes" },
    { title: "Proprietário Atual V2", isNew: true, fields: ["Placa"], description: "Informa o proprietário atual do veículo.", icon: UserCheck, type: "proprietario-v2" },
    { title: "Consulta Leilão", isNew: true, fields: ["Placa"], description: "", icon: Gavel, type: "consulta-leilao" },
    { title: "Consulta Chassi", description: "Através do Chassi/Motor, você pode obter informações sobre o veículo.", icon: Settings, type: "consulta-chassi" },
    { title: "Reemissão ATPV-E", fields: ["chassi"], description: "Através do chassi, retorna ATPV! Não pode ter comunicado de venda.", icon: File, type: "reemissao-atpv-e" },
    { title: "Gravame V2", isNew: true, fields: ["Placa"], description: "Através da placa, você pode verificar se há algum gravame registrado no veículo.", icon: Lock, type: "gravame-v2" },
    { title: "Verifica autenticidade CRV", description: "Verifique se o CRV é válido Gratis.", icon: CheckCircle, type: "verifica-crv" },
];

const ConsultationCard: React.FC<{
    title: string;
    isNew?: boolean;
    fields?: string[];
    description?: string;
    icon: React.ElementType;
    onConsult: () => void;
}> = ({ title, isNew, fields, description, icon: Icon, onConsult }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col group transition-all duration-300 hover:border-[#0f43aa] hover:shadow-lg">
        <div className="flex-grow space-y-3 flex flex-col">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-[#0f43aa] flex-shrink-0" />
                    <h3 className="font-bold text-gray-800">{title}</h3>
                </div>
                {isNew && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">NOVO</span>}
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
             <button onClick={onConsult} className="w-full bg-[#0f43aa] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-[#0c3688] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f43aa] transition-colors duration-200">Consultar</button>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ onSelectConsultation }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {consultations.map((consult) => <ConsultationCard key={consult.type} {...consult} onConsult={() => onSelectConsultation(consult.type)} />)}
        </div>
    </div>
  );
};

export default Dashboard;