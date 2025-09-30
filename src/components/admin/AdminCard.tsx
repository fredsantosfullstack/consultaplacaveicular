import React from 'react';

const AdminCard: React.FC<{ icon: React.ElementType; title: string; description: string; onClick: () => void }> = ({ icon: Icon, title, description, onClick }) => (
    <button 
        onClick={onClick} 
        className="bg-white p-6 rounded-lg border border-gray-200 flex items-center space-x-4 text-left hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
    >
        <Icon className="w-10 h-10 text-[#0f43aa] flex-shrink-0" />
        <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </button>
);

export default AdminCard;