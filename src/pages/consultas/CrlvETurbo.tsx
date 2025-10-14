import { useState, useEffect } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';
import { publicApi } from '../../services/api';

export default function CrlvETurbo() {
  const [estados, setEstados] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await publicApi.get('/crlve-orders/states');
        const estadosFormatados = response.data.map((estado: any) => ({
          value: estado.state_code.toLowerCase(),
          label: `${estado.state_name} (${estado.state_code}) - ${Number(estado.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
        }));
        setEstados(estadosFormatados);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        // Fallback: lista vazia ou estados padrão
        setEstados([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEstados();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[#000042]" size={48} />
      </div>
    );
  }

  return (
    <ConsultaForm
      titulo="CRLV-E TURBO"
      descricao="CRLV-E para múltiplos estados"
      slug="crlv-e-turbo"
      icon={<Zap className="w-8 h-8" />}
      campos={[
        {
          name: 'estado',
          label: 'Selecione o Estado',
          type: 'select',
          required: true,
          options: estados
        },
        {
          name: 'placa',
          label: 'Placa do Veículo',
          type: 'text',
          placeholder: 'ABC1234',
          required: true,
          maxLength: 7
        },
        {
          name: 'renavam',
          label: 'RENAVAM',
          type: 'text',
          placeholder: '12345678901',
          required: false,
          maxLength: 11
        },
        {
          name: 'cpf',
          label: 'CPF ou CNPJ',
          type: 'text',
          placeholder: '000.000.000-00',
          required: false,
          maxLength: 18
        }
      ]}
    />
  );
}
