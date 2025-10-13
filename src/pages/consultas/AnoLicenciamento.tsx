import { Calendar } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function AnoLicenciamento() {
  return (
    <ConsultaForm
      titulo="Ano Licenciamento BIN Nacional"
      descricao="Consulta ano de licenciamento"

      slug="ano-licenciamento-bin-nacional"
      icon={<Calendar className="w-8 h-8" />}
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
