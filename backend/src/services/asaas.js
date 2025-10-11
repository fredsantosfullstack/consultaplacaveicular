import axios from 'axios';

const ASAAS_API_URL = process.env.ASAAS_ENV === 'production' 
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

const asaasApi = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': ASAAS_API_KEY
  }
});

/**
 * Cria uma cobrança PIX no Asaas
 * @param {Object} data - Dados da cobrança
 * @param {string} data.customer - ID do cliente no Asaas
 * @param {number} data.value - Valor da cobrança
 * @param {string} data.description - Descrição da cobrança
 * @param {Date} data.dueDate - Data de vencimento
 */
export async function createPixPayment({ customer, value, description, dueDate }) {
  try {
    const response = await asaasApi.post('/payments', {
      customer,
      billingType: 'PIX',
      value,
      dueDate,
      description,
      externalReference: `RECARGA_${Date.now()}`,
      postalService: false
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar cobrança PIX no Asaas:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.description || 'Erro ao criar cobrança PIX');
  }
}

/**
 * Busca o QR Code PIX de uma cobrança
 * @param {string} paymentId - ID da cobrança no Asaas
 */
export async function getPixQrCode(paymentId) {
  try {
    const response = await asaasApi.get(`/payments/${paymentId}/pixQrCode`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar QR Code PIX:', error.response?.data || error.message);
    throw new Error('Erro ao buscar QR Code PIX');
  }
}

/**
 * Consulta o status de uma cobrança
 * @param {string} paymentId - ID da cobrança no Asaas
 */
export async function getPaymentStatus(paymentId) {
  try {
    const response = await asaasApi.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar status do pagamento:', error.response?.data || error.message);
    throw new Error('Erro ao consultar status do pagamento');
  }
}

/**
 * Cria ou busca um cliente no Asaas
 * @param {Object} userData - Dados do usuário
 */
export async function createOrGetCustomer(userData) {
  try {
    // Primeiro tenta buscar por CPF/CNPJ
    if (userData.cpfCnpj) {
      const searchResponse = await asaasApi.get('/customers', {
        params: { cpfCnpj: userData.cpfCnpj }
      });

      if (searchResponse.data.data && searchResponse.data.data.length > 0) {
        return searchResponse.data.data[0];
      }
    }

    // Se não encontrou, cria novo cliente
    const response = await asaasApi.post('/customers', {
      name: userData.name,
      email: userData.email,
      cpfCnpj: userData.cpfCnpj,
      phone: userData.phone,
      mobilePhone: userData.mobilePhone,
      notificationDisabled: false
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar/buscar cliente no Asaas:', error.response?.data || error.message);
    throw new Error('Erro ao processar cliente no Asaas');
  }
}

export default {
  createPixPayment,
  getPixQrCode,
  getPaymentStatus,
  createOrGetCustomer
};
