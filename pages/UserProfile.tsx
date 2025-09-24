import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserCircle, FaPencilAlt } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  // Dummy user data
  const [userData, setUserData] = useState({
    name: 'João da Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 99999-8888',
    company: 'Golden Veicular',
    document: '123.456.789-00'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the data here, e.g., via an API call
    console.log('Saving data:', userData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Meu Perfil</h1>
        <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-blue-600 hover:underline">
          <FaArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>
      
      <form onSubmit={handleSave} className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative group">
                <FaUserCircle className="w-24 h-24 md:w-32 md:h-32 text-gray-300" />
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
                    <FaPencilAlt className="w-5 h-5" />
                    <input id="avatar-upload" type="file" className="hidden" />
                </label>
            </div>
            <div className="flex-grow space-y-4 w-full">
                <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                    {!isEditing && (
                        <button type="button" onClick={() => setIsEditing(true)} className="flex items-center space-x-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                            <FaPencilAlt className="w-5 h-5"/>
                            <span>Editar</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
                        <input type="text" name="name" value={userData.name} onChange={handleInputChange} disabled={!isEditing} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500">CPF/CNPJ</label>
                        <input type="text" name="document" value={userData.document} onChange={handleInputChange} disabled={!isEditing} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <input type="email" name="email" value={userData.email} onChange={handleInputChange} disabled={!isEditing} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500">Telefone</label>
                        <input type="tel" name="phone" value={userData.phone} onChange={handleInputChange} disabled={!isEditing} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500">Empresa</label>
                        <input type="text" name="company" value={userData.company} onChange={handleInputChange} disabled={!isEditing} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"/>
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end space-x-4 pt-6">
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                            Salvar Alterações
                        </button>
                    </div>
                )}
            </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;