import React from 'react';

const StatCard: React.FC<{icon: React.ElementType; title: string; value: string; color: string;}> = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
        <Icon className="w-10 h-10 text-gray-500"/>
        <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default StatCard;