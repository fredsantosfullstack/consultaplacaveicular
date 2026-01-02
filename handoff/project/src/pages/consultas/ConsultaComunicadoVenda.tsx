import { FileText } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function ConsultaComunicadoVenda() {
  return (
    <ConsultaForm
      titulo="Consulta Comunicado Venda"
      descricao="Verifica comunicado de venda"
      slug="consulta-comunicado-venda"
      icon={<FileText className="w-8 h-8" />}
      campos={[
        {
          name: 'placa',
          label: 'Placa do Veículo',
          type: 'text',
          placeholder: 'ABC1234',
          required: true,
          maxLength: 7
        }
      ]}
    />
  );
}
