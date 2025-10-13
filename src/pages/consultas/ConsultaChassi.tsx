import { Hash } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function ConsultaChassi() {
  return (
    <ConsultaForm
      titulo="Consulta Chassi"
      descricao="Consulta por número do chassi"
      slug="consulta-chassi"
      icon={<Hash className="w-8 h-8" />}
      campos={[
        {
          name: 'chassi',
          label: 'Número do Chassi',
          type: 'text',
          placeholder: '9BWZZZ377VT004251',
          required: true,
          maxLength: 17
        }
      ]}
    />
  );
}
