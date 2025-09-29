import React from 'react';

const AdminCard: React.FC<{ icon: React.ElementType; title: string; description: string; onClick: () => void }> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <Icon className="w-10 h-10 text-[#D2AE6D] flex-shrink-0" />
        <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    </button>
);

export default AdminCard;