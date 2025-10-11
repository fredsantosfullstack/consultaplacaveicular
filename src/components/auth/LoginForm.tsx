import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { profile, login } = useAuth();

  useEffect(() => {
    if (profile) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password, rememberMe });
      if (response.data.token) {
        await login(response.data.token, rememberMe);
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-8">
      <div className="relative">
        <input 
          id="email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          className="peer w-full bg-transparent border-b-2 border-white/30 pt-4 pb-1 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
          placeholder="Email"
        />
        <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm">USERNAME</label>
      </div>

      <div className="relative">
        <input 
          id="password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          className="peer w-full bg-transparent border-b-2 border-white/30 pt-4 pb-1 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
          placeholder="Password"
        />
        <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm">PASSWORD</label>
      </div>

      <div className="flex items-center">
        <input id="remember-me" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="h-4 w-4 bg-transparent text-blue-500 border-white/30 rounded focus:ring-blue-500" />
        <label htmlFor="remember-me" className="ml-2 block text-sm">Keep me Signed in</label>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 rounded-full text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-300 transform hover:scale-105">
        {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
      </button>

      <div className="text-center">
        <Link to="/recuperar-senha" className="text-sm hover:underline">Forgot Password?</Link>
      </div>
    </form>
  );
};

export default LoginForm;
