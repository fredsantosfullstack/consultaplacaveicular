import { MapPin } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function BaseEstadual() {
  return (
    <ConsultaForm
      titulo="Base Estadual"
      descricao="Consulta base estadual"
      slug="base-estadual"
      icon={<MapPin className="w-8 h-8" />}
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
