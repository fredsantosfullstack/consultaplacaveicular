import { Lock } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function GravameV2() {
  return (
    <ConsultaForm
      titulo="Gravame V2"
      descricao="Consulta de gravames e restrições financeiras"
      preco={8.00}
      slug="gravame-v2"
      icon={<Lock className="w-8 h-8" />}
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
