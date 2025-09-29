import React, { useState } from 'react';
import { Notification } from '../../../types';
import { showSuccess, showError } from '../../utils/toast';
import { ArrowLeft, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';

interface NotificationManagementProps {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    goBack: () => void;
}

const NotificationManagement: React.FC<NotificationManagementProps> = ({ notifications, setNotifications, goBack }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [frequency, setFrequency] = useState<Notification['frequency']>('once');

    const handleAddNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim() || !message.trim()) {
            showError("Título e Mensagem são obrigatórios.");
            return;
        }
        const newNotification: Notification = { id: new Date().toISOString(), title, message, status: 'active', frequency };
        setNotifications(prev => [newNotification, ...prev]);
        setTitle(''); setMessage(''); setFrequency('once');
        showSuccess("Aviso adicionado com sucesso!");
    };

    const handleToggleStatus = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: n.status === 'active' ? 'paused' : 'active' } : n));
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este aviso?')) {
            setNotifications(prev => prev.filter(n => n.id !== id));
            showSuccess("Aviso excluído com sucesso!");
        }
    };

    return (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Notificações</h2>
                <button onClick={goBack} className="flex items-center space-x-2 text-[#0f43aa] hover:underline"><ArrowLeft className="w-4 h-4"/><span>Voltar</span></button>
            </div>
            <form onSubmit={handleAddNotification} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                 <h3 className="text-lg font-semibold text-gray-700">Criar Novo Aviso</h3>
                 <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className="w-full p-2 border rounded"/>
                 <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Mensagem" className="w-full p-2 border rounded"></textarea>
                 <select value={frequency} onChange={e => setFrequency(e.target.value as any)} className="w-full p-2 border rounded">
                    <option value="once">Apenas uma vez</option>
                    <option value="hourly">A cada hora</option>
                    <option value="daily">A cada 24 horas</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                 </select>
                 <button type="submit" className="bg-[#0f43aa] text-white p-2 rounded hover:bg-[#0c3688]">Adicionar Aviso</button>
            </form>
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-3">
                {notifications.map(n => (
                     <div key={n.id} className="p-4 rounded-lg flex justify-between items-center border">
                        <div>
                            <p className="font-bold">{n.title}</p>
                            <p>{n.message}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleToggleStatus(n.id)}>{n.status === 'active' ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}</button>
                            <button onClick={() => handleDelete(n.id)}><Trash2 className="w-5 h-5" /></button>
                        </div>
                     </div>
                ))}
            </div>
         </div>
    );
};

export default NotificationManagement;