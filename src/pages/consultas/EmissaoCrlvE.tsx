import { Car, AlertCircle } from 'lucide-react';
import ConsultaForm from '../../components/ConsultaForm';

export default function EmissaoCrlvE() {
  const estados = [
    { value: 'pi', label: 'Piauí (PI)' },
    { value: 'ro', label: 'Rondônia (RO)' },
    { value: 'ac', label: 'Acre (AC)' },
    { value: 'df', label: 'Distrito Federal (DF)' },
    { value: 'sc', label: 'Santa Catarina (SC)' },
    { value: 'rj', label: 'Rio de Janeiro (RJ)' },
    { value: 'al', label: 'Alagoas (AL)' },
    { value: 'pb', label: 'Paraíba (PB)' },
    { value: 'pe', label: 'Pernambuco (PE)' },
    { value: 'es', label: 'Espírito Santo (ES)' },
    { value: 'ce', label: 'Ceará (CE)' },
    { value: 'ms', label: 'Mato Grosso do Sul (MS)' }
  ];

  const avisoContent = (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-3">Atenção:</h3>
          <p className="text-sm text-gray-700 mb-3">
            Antes de enviar a solicitação, verifique se o veículo não possui algum dos itens abaixo que impeça a emissão do CRLV-e:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-4">
            <li>Intenção/Comunicação de Venda</li>
            <li>Veículo Baixado</li>
            <li>UF atual do veículo diferente</li>
            <li>Verificar no Detran se o licenciamento está no ano atual ou anterior</li>
            <li>Verificar se existem multas ativas</li>
            <li>Bloqueios diversos</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-gray-800 font-semibold">
              ATENÇÃO! SÓ SERÁ EMITIDO O CRLV-e DO ANO VIGENTE QUE ESTIVER DISPONÍVEL, APÓS A EMISSÃO NÃO SERÁ DEVOLVIDO O VALOR, UMA VEZ QUE ESTE INFORME JÁ DEIXA CLARO QUE É ESSENCIAL A PESQUISA PRÉVIA (CRLV-e não emitido não será cobrado).
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">CRLV Disponível para todos os estados:</p>
            <p className="text-sm text-gray-700">
              PI, RO, AC, DF, SC, RJ, AL, PB, PE, ES, CE, MS. Estamos adicionando as UFs aos poucos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ConsultaForm
      titulo="Emissão CRLV-E OUTRAS UF"
      descricao="Emissão de CRLV-E para estados disponíveis"
      preco={15.00}
      slug="crlve"
      icon={<Car className="w-8 h-8" />}
      avisoPersonalizado={avisoContent}
      campos={[
        {
          name: 'placa',
          label: 'Placa do Veículo:',
          type: 'text',
          placeholder: 'Placa',
          required: true,
          maxLength: 7
        },
        {
          name: 'renavam',
          label: 'Renavam:',
          type: 'text',
          placeholder: 'Renavam',
          required: true,
          maxLength: 11
        },
        {
          name: 'cpf',
          label: 'Documento CPF ou CNPJ:',
          type: 'text',
          placeholder: 'CPF ou CNPJ',
          required: true,
          maxLength: 18
        },
        {
          name: 'estado',
          label: 'UF (Estado):',
          type: 'select',
          required: true,
          options: estados
        }
      ]}
      textoBotao="Solicitar CRLV-e"
    />
  );
}
