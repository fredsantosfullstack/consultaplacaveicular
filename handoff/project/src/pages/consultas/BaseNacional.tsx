import { Database } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function BaseNacional() {
  return (
    <ConsultaForm
      titulo="Base Nacional"
      descricao="Base oficial do DENATRAN"
      slug="base-nacional"
      icon={<Database className="w-8 h-8" />}
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
