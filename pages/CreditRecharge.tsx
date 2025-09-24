import React, { useState } from 'react';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreditRechargeProps {
  // setCurrentPage: (page: Page) => void; // Removed
}

const presetAmounts = [20, 50, 80, 100, 150, 200];

const CreditRecharge: React.FC<CreditRechargeProps> = () => { // Removed setCurrentPage from props
    const [amount, setAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    const navigate = useNavigate();

    const handlePresetClick = (preset: number) => {
        setAmount(preset.toString());
        setSelectedPreset(preset);
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
        
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue) || !presetAmounts.includes(numericValue)) {
            setSelectedPreset(null);
        } else {
            setSelectedPreset(numericValue);
        }
    }
    
    return (
        <div className="min-h-full bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200/50 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recarga de Créditos</h1>
                    <p className="text-gray-500 mt-2">Selecione um valor ou digite uma quantia para gerar seu QR Code Pix.</p>
                </div>
                
                <div className="text-center">
                    <label htmlFor="valor" className="sr-only">Valor da recarga</label>
                    <div className="flex items-center justify-center">
                         <span className="text-3xl text-gray-400 font-semibold mr-2">
                            R$
                         </span>
                        <input 
                            id="valor"
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0"
                            className="w-48 text-center bg-transparent text-6xl font-bold text-blue-600 tracking-tight border-none p-0 focus:ring-0"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {presetAmounts.map(p => (
                         <button 
                            key={p} 
                            onClick={() => handlePresetClick(p)} 
                            className={`w-full py-3 rounded-lg font-semibold text-center transition-all duration-200 border-2 ${
                                selectedPreset === p 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                        >
                           R$ {p}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 pt-4">
                    <button className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <QrCode className="w-6 h-6 mr-3" />
                        Gerar QR Code
                    </button>
                     <button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center space-x-2 text-gray-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar ao Início</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreditRecharge;