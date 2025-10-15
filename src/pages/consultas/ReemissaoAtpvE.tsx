import { FileText } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function ReemissaoAtpvE() {
  return (
    <ConsultaForm
      titulo="Reemissão ATPV-E"
      descricao="Autorização para Transferência de Propriedade de Veículo Eletrônica"
      slug="reemissao-atpv-e"
      icon={<FileText className="w-8 h-8" />}
      campos={[
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
          required: true,
          maxLength: 11
        }
      ]}
    />
  );
}
