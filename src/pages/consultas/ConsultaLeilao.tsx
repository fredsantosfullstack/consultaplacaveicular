import { Search } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function ConsultaLeilao() {
  return (
    <ConsultaForm
      titulo="Consulta Leilão"
      descricao="Consulta informações sobre leilão do veículo"
      preco={15.00}
      slug="consulta-leilao"
      icon={<Search className="w-8 h-8" />}
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
