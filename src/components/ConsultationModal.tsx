import React, { useState } from 'react';
import { X, Search, AlertCircle, CheckCircle } from 'lucide-react';
// import { apiService } from '../services/apiService'; // Removido
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceTitle: string;
  fields?: string[];
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  serviceTitle,
  fields = []
}) => {
  const [plate, setPlate] = useState('');
  const [chassis, setChassis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!plate && !chassis) {
      setError('Informe pelo menos a placa ou o chassi');
      return;
    }

    setIsLoading(true);

    try {
      const consultationData = {
        service_code: serviceType,
        ...(plate && { plate: plate.toUpperCase() }),
        ...(chassis && { chassis: chassis.toUpperCase() })
      };

      // Simulação de consulta - integração com Supabase será implementada
      const consultation = {
        id: Date.now(),
        ...consultationData,
        result: 'Consulta simulada - dados não disponíveis no momento',
        status: 'completed',
        created_at: new Date().toISOString()
      };
      setResult(consultation);
      
      toast.success('Consulta realizada com sucesso!');
    } catch (error: any) {
      setError(error.message || 'Erro ao realizar consulta');
      toast.error(error.message || 'Erro ao realizar consulta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPlate('');
    setChassis('');
    setResult(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{serviceTitle}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Saldo do usuário */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Saldo atual:</strong> R$ 0,00 (Em desenvolvimento)
                </p>
              </div>

              {/* Campos de entrada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-2">
                    Placa do Veículo
                  </label>
                  <input
                    type="text"
                    id="plate"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="ABC1234 ou ABC1D23"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="chassis" className="block text-sm font-medium text-gray-700 mb-2">
                    Chassi (opcional)
                  </label>
                  <input
                    type="text"
                    id="chassis"
                    value={chassis}
                    onChange={(e) => setChassis(e.target.value.toUpperCase())}
                    placeholder="Número do chassi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || (!plate && !chassis)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Consultando...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Consultar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Resultado da consulta */
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">Consulta realizada com sucesso!</p>
              </div>

              {/* Informações da consulta */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Detalhes da Consulta</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Serviço:</span>
                    <p className="font-medium">{serviceTitle}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Preço:</span>
                    <p className="font-medium">R$ {result.price?.toFixed(2)}</p>
                  </div>
                  {result.plate && (
                    <div>
                      <span className="text-gray-600">Placa:</span>
                      <p className="font-medium">{result.plate}</p>
                    </div>
                  )}
                  {result.chassis && (
                    <div>
                      <span className="text-gray-600">Chassi:</span>
                      <p className="font-medium">{result.chassis}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-medium capitalize">{result.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Data:</span>
                    <p className="font-medium">
                      {new Date(result.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resultado dos dados */}
              {result.result_data && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Resultado da Consulta</h3>
                  <div className="space-y-2 text-sm">
                    {result.result_data.data && (
                      <div className="space-y-1">
                        <p><strong>Informações do Veículo:</strong> {result.result_data.data.vehicle_info}</p>
                        <p><strong>Proprietário:</strong> {result.result_data.data.owner}</p>
                        <p><strong>Restrições:</strong> {result.result_data.data.restrictions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nova Consulta
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
