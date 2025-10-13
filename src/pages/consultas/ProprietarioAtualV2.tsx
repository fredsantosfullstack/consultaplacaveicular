import { User } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function ProprietarioAtualV2() {
  return (
    <ConsultaForm
      titulo="Proprietário Atual V2"
      descricao="Consulta informações do proprietário atual do veículo"
      slug="proprietario-atual-v2"
      icon={<User className="w-8 h-8" />}
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
