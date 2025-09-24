import React from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { Notification } from '../types';
import toast from 'react-hot-toast';

interface NotificationToastProps {
  notification: Notification;
  toastId: string;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, toastId, onClose }) => {
  return (
    <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-5 border border-gray-200 animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <FaBell className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{notification.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
        <button onClick={() => onClose(toastId)} className="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;