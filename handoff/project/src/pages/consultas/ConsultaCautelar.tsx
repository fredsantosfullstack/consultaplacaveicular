import { AlertTriangle } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function ConsultaCautelar() {
  return (
    <ConsultaForm
      titulo="Consulta Cautelar"
      descricao="Verifica medidas cautelares"
      slug="consulta-cautelar"
      icon={<AlertTriangle className="w-8 h-8" />}
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
