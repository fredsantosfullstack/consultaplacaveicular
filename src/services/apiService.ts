/**
 * Serviço de API para comunicação com o backend PHP
 */

// Configuração da API
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost/golden/api' 
  : '/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  balance: number;
  avatar_url?: string;
  created_at: string;
}

interface Consultation {
  id: number;
  user_id: number;
  service_code: string;
  plate?: string;
  chassis?: string;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  result_data?: any;
  created_at: string;
  service_name?: string;
}

interface PriceItem {
  id: number;
  service_name: string;
  service_code: string;
  price: number;
  status: 'active' | 'inactive';
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos de Autenticação
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(response.message);
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout.php', { method: 'POST' });
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  async verifyToken(): Promise<User> {
    const response = await this.request<{ user: User }>('/auth/verify.php');
    
    if (response.success && response.data) {
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      return response.data.user;
    }

    throw new Error(response.message);
  }

  async register(data: { name: string; email: string; password: string; document_type: string; document_number: string; phone: string; }): Promise<void> {
    const response = await this.request('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const response = await this.request('/auth/request-reset.php', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await this.request('/auth/reset-password.php', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    if (!response.success) {
      throw new Error(response.message);
    }
  }

  // Métodos de Usuário
  async getProfile(): Promise<User> {
    const response = await this.request<User>('/users/profile.php');
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.request<User>('/users/profile.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  async getUsers(page = 1, limit = 10, search = ''): Promise<{
    users: User[];
    pagination: any;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });

    const response = await this.request<{
      users: User[];
      pagination: any;
    }>(`/users/list.php?${params}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  // Métodos de Consultas
  async createConsultation(data: {
    service_code: string;
    plate?: string;
    chassis?: string;
  }): Promise<Consultation> {
    const response = await this.request<Consultation>('/consultations/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  async getConsultationHistory(
    page = 1,
    limit = 10,
    filters: {
      status?: string;
      service_code?: string;
      start_date?: string;
      end_date?: string;
    } = {}
  ): Promise<{
    consultations: Consultation[];
    pagination: any;
    statistics: any;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await this.request<{
      consultations: Consultation[];
      pagination: any;
      statistics: any;
    }>(`/consultations/history.php?${params}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  // Métodos Financeiros
  async getBalance(): Promise<{
    current_balance: number;
    recent_transactions: any[];
    monthly_statistics: any;
  }> {
    const response = await this.request<{
      current_balance: number;
      recent_transactions: any[];
      monthly_statistics: any;
    }>('/financial/balance.php');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  async rechargeCredits(amount: number, paymentMethod = 'manual'): Promise<{
    transaction_id: number;
    amount_added: number;
    new_balance: number;
  }> {
    const response = await this.request<{
      transaction_id: number;
      amount_added: number;
      new_balance: number;
    }>('/financial/recharge.php', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        payment_method: paymentMethod,
      }),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  // Métodos de Preços
  async getPrices(): Promise<{
    all_services: PriceItem[];
    categories: {
      consultas: PriceItem[];
      crlv: PriceItem[];
      outros: PriceItem[];
    };
    total_services: number;
  }> {
    const response = await this.request<{
      all_services: PriceItem[];
      categories: {
        consultas: PriceItem[];
        crlv: PriceItem[];
        outros: PriceItem[];
      };
      total_services: number;
    }>('/services/prices.php');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message);
  }

  async updatePrice(serviceId: number, price: number): Promise<void> {
    const response = await this.request('/services/prices.php', {
      method: 'PUT',
      body: JSON.stringify({
        service_id: serviceId,
        price,
      }),
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  // Método para verificar se está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
      return true;
    }
    return !!this.token;
  }

  // Método para obter dados do usuário do localStorage
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // ===== MÉTODOS DE LOGOTIPOS =====
  async uploadLogo(payload: {
    type: 'menu_logo' | 'login_logo';
    data: string;
    filename: string;
    mime_type: string;
    file_size: number;
  }): Promise<void> {
    const response = await this.request<any>('/services/logos.php', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getLogo(type: 'menu_logo' | 'login_logo'): Promise<string | null> {
    try {
      const response = await this.request<{ data: string }>(`/services/logos.php?type=${type}`);
      return response.success ? response.data?.data : null;
    } catch (error) {
      return null;
    }
  }

  async getAllLogos(): Promise<{ menu_logo: string | null; login_logo: string | null }> {
    try {
      const response = await this.request<{ menu_logo?: string; login_logo?: string }>('/services/logos.php');
      return {
        menu_logo: response.data?.menu_logo || null,
        login_logo: response.data?.login_logo || null
      };
    } catch (error) {
      return { menu_logo: null, login_logo: null };
    }
  }

  async deleteLogo(type: 'menu_logo' | 'login_logo'): Promise<void> {
    const response = await this.request<any>('/services/logos.php', {
      method: 'DELETE',
      body: JSON.stringify({ type })
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  // ===== MÉTODOS DE CONFIGURAÇÕES =====
  async getSettings(): Promise<any> {
    const response = await this.request<any>('/services/settings.php');
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error(response.message);
  }

  async updateSetting(key: string, value: string): Promise<void> {
    const response = await this.request<any>('/services/settings.php', {
        method: 'PUT',
        body: JSON.stringify({ key, value })
    });
    if (!response.success) {
        throw new Error(response.message);
    }
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
      const response = await this.request<User>(`/users/update.php?id=${userId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
      });
      if (response.success && response.data) {
          return response.data;
      }
      throw new Error(response.message);
  }
}

// Instância singleton
export const apiService = new ApiService();
export default apiService;

// Tipos exportados
export type { User, Consultation, PriceItem, ApiResponse };
