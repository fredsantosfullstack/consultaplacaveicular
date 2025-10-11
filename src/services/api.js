import axios from 'axios';

// Cria uma instância do axios com a baseURL para a nossa API
// O proxy do Vite cuidará do redirecionamento em desenvolvimento
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Interceptor para adicionar o token JWT em futuras requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    // Assegura que headers exista para evitar erros
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Instância pública sem interceptador de token
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
});

export default api;
