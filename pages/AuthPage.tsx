import React, { useState } from 'react';
import LoginForm from '../src/components/auth/LoginForm';
import SignUpForm from '../src/components/auth/SignUpForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: 'url(/background-auth.jpg)' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20">
        <div className="flex justify-center mb-8 space-x-8 border-b border-white/20">
          <button 
            onClick={() => setActiveTab('signin')}
            className={`pb-2 text-lg font-medium transition-colors ${activeTab === 'signin' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>
            SIGN IN
          </button>
          <button 
            onClick={() => setActiveTab('signup')}
            className={`pb-2 text-lg font-medium transition-colors ${activeTab === 'signup' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>
            SIGN UP
          </button>
        </div>

        {activeTab === 'signin' ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default AuthPage;
