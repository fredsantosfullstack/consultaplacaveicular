import { ShieldCheck } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function CodigoSegurancaPDF() {
  return (
    <ConsultaForm
      titulo="Código de segurança PDF"
      descricao="Através da placa Retorna CRV DIGITAL"

      slug="codigo-seguranca-pdf"
      icon={<ShieldCheck className="w-8 h-8" />}
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
