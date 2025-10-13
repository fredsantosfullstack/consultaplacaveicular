import { Zap } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function CrlvETurbo() {
  const estados = [
    { value: 'ac', label: 'Acre (AC)' },
    { value: 'al', label: 'Alagoas (AL)' },
    { value: 'ap', label: 'Amapá (AP)' },
    { value: 'am', label: 'Amazonas (AM)' },
    { value: 'ba', label: 'Bahia (BA)' },
    { value: 'ce', label: 'Ceará (CE)' },
    { value: 'df', label: 'Distrito Federal (DF)' },
    { value: 'es', label: 'Espírito Santo (ES)' },
    { value: 'go', label: 'Goiás (GO)' },
    { value: 'ma', label: 'Maranhão (MA)' },
    { value: 'mt', label: 'Mato Grosso (MT)' },
    { value: 'ms', label: 'Mato Grosso do Sul (MS)' },
    { value: 'mg', label: 'Minas Gerais (MG)' },
    { value: 'pa', label: 'Pará (PA)' },
    { value: 'pb', label: 'Paraíba (PB)' },
    { value: 'pr', label: 'Paraná (PR)' },
    { value: 'pe', label: 'Pernambuco (PE)' },
    { value: 'pi', label: 'Piauí (PI)' },
    { value: 'rj', label: 'Rio de Janeiro (RJ)' },
    { value: 'rn', label: 'Rio Grande do Norte (RN)' },
    { value: 'rs', label: 'Rio Grande do Sul (RS)' },
    { value: 'ro', label: 'Rondônia (RO)' },
    { value: 'rr', label: 'Roraima (RR)' },
    { value: 'sc', label: 'Santa Catarina (SC)' },
    { value: 'sp', label: 'São Paulo (SP)' },
    { value: 'se', label: 'Sergipe (SE)' },
    { value: 'to', label: 'Tocantins (TO)' }
  ];

  return (
    <ConsultaForm
      titulo="CRLV-E TURBO"
      descricao="CRLV-E para múltiplos estados"
      slug="crlv-e-turbo"
      icon={<Zap className="w-8 h-8" />}
      campos={[
        {
          name: 'estado',
          label: 'Selecione o Estado',
          type: 'select',
          required: true,
          options: estados
        },
        {
          name: 'placa',
          label: 'Placa do Veículo',
          type: 'text',
          placeholder: 'ABC1234',
          required: true,
          maxLength: 7
        },
        {
          name: 'renavam',
          label: 'RENAVAM',
          type: 'text',
          placeholder: '12345678901',
          required: false,
          maxLength: 11
        },
        {
          name: 'cpf',
          label: 'CPF ou CNPJ',
          type: 'text',
          placeholder: '000.000.000-00',
          required: false,
          maxLength: 18
        }
      ]}
    />
  );
}
