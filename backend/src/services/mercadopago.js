import axios from 'axios';
import db from '../config/db.js';

const MERCADO_PAGO_API_URL = 'https://api.mercadopago.com/v1';
const DEFAULT_BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Função para obter o token do Mercado Pago do banco de dados
async function getMercadoPagoToken() {
  try {
    const [settings] = await db.query(
      'SELECT setting_value FROM site_settings WHERE setting_key = ?',
      ['mercado_pago_access_token']
    );
    return settings.length > 0 ? settings[0].setting_value : null;
  } catch (error) {
    console.error('Erro ao buscar token Mercado Pago:', error);
    return null;
  }
}

// Função para inicializar a API do Mercado Pago
async function initMercadoPagoApi() {
  const token = await getMercadoPagoToken();
  if (!token) {
    throw new Error('Token Mercado Pago não configurado. Configure no painel admin.');
  }

  return axios.create({
    baseURL: MERCADO_PAGO_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * Cria um pagamento PIX no Mercado Pago e retorna QR Code
 */
export async function createPixPayment({ value, description, userId, userEmail }) {
  try {
    const api = await initMercadoPagoApi();
    const idempotencyKey = `pix-${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const notificationUrl = `${DEFAULT_BACKEND_URL.replace(/\/$/, '')}/api/payments/webhook`;

    const paymentData = {
      transaction_amount: parseFloat(value),
      description: description,
      payment_method_id: 'pix',
      payer: {
        email: userEmail || 'customer@example.com',
        first_name: 'Cliente',
        last_name: 'Sistema'
      },
      external_reference: `RECARGA_${userId}_${Date.now()}`,
      notification_url: notificationUrl
    };

    const response = await api.post('/payments', paymentData, {
      headers: {
        'X-Idempotency-Key': idempotencyKey
      }
    });
    
    console.log('✅ Pagamento PIX criado no Mercado Pago:', response.data.id);

    return {
      id: response.data.id,
      status: response.data.status,
      qrCode: response.data.point_of_interaction?.transaction_data?.qr_code_base64,
      qrCodeText: response.data.point_of_interaction?.transaction_data?.qr_code,
      ticketUrl: response.data.point_of_interaction?.transaction_data?.ticket_url
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX Mercado Pago:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Erro ao criar pagamento PIX');
  }
}

/**
 * Consulta o status de um pagamento
 */
export async function getPaymentStatus(paymentId) {
  try {
    const api = await initMercadoPagoApi();
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar status do pagamento:', error.response?.data || error.message);
    throw new Error('Erro ao consultar status do pagamento');
  }
}

/**
 * Verifica se o token Mercado Pago está configurado
 */
export async function isConfigured() {
  const token = await getMercadoPagoToken();
  return !!token;
}

export default {
  createPixPayment,
  getPaymentStatus,
  isConfigured,
  getMercadoPagoToken
};
