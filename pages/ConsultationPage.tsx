import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { publicApi } from '../src/services/api';
import UserLayout from '../src/layouts/UserLayout';

// Estrutura de exemplo para os campos do formulário
interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}


const ConsultationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [consultationTitle, setConsultationTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      let fields: FormField[] = [];
      let title = '';

      // Define os campos e o título com base no slug
      if (slug === 'base-estadual') {
        fields = [{ name: 'placa', label: 'Placa do Veículo', type: 'text', placeholder: 'ABC1234' }];
        title = 'Base Estadual';
      } else {
        // Adicione outros casos aqui no futuro
        title = 'Consulta Desconhecida';
      }

      setFormFields(fields);
      setConsultationTitle(title);
    }
  }, [slug]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await publicApi.post(`/consultations/execute/${slug}`,
        data,
        {
          responseType: 'blob', // Importante para receber o PDF
        }
      );

      // Cria um URL para o Blob e simula um clique para baixar o arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consulta-${slug}-${data.placa}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setResult({ success: true, message: 'Download do PDF iniciado com sucesso!' });

    } catch (err: any) {
      if (err.response && err.response.data) {
        // Como a resposta de erro também pode ser um blob, precisamos convertê-la
        const errorData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(JSON.parse(reader.result as string));
          reader.onerror = () => resolve({ msg: 'Erro ao processar a resposta de erro.' });
          reader.readAsText(err.response.data);
        });
        setResult({ success: false, error: errorData });
      } else {
        setResult({ success: false, error: { msg: 'Erro de conexão. Tente novamente.' } });
      }
    }

    setIsLoading(false);
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800">
          <ArrowLeft size={16} />
          Voltar para as Consultas
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{consultationTitle}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field: FormField) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  required
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#076AC2]"
                />
              </div>
            ))}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#076AC2] text-white font-bold py-3 rounded-md hover:bg-[#055a9f] flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Realizar Consulta'}
            </button>
          </form>
        </div>

        {result && (
          <div className={`p-4 rounded-lg mt-6 ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">{result.success ? 'Sucesso' : 'Erro'}</p>
            <p>{result.success ? result.message : result.error?.msg || 'Ocorreu um erro inesperado.'}</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default ConsultationPage;
