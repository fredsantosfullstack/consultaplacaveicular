import { FileSpreadsheet } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function CsvRenainfRenajud() {
  return (
    <ConsultaForm
      titulo="CSV - RENAINF - RENAJUD - RECALL - BIN - PROPRIETAR"
      descricao="Consulta completa com múltiplas informações: CSV, RENAINF, RENAJUD, RECALL, BIN e dados do proprietário"
      preco={25.00}
      slug="csv-renainf-renajud-recall-bin-proprietar"
      icon={<FileSpreadsheet className="w-8 h-8" />}
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
