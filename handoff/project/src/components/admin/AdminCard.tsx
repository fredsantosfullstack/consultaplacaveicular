import React from 'react';

interface AdminCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ icon, title, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center space-y-4"
    >
      <div className="bg-gray-100 p-4 rounded-full">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

export default AdminCard;