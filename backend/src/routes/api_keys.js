import express from 'express';
import axios from 'axios';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// Rota para testar as chaves de API
router.post('/test', authenticateToken, isAdmin, async (req, res) => {
  const { asaasApiKey, consultationApiKey } = req.body;

  const results = {
    asaas: false,
    consultation: false,
  };

  // --- Teste da API do Asaas ---
  if (asaasApiKey) {
    try {
      // Tenta fazer uma chamada simples para uma rota protegida do Asaas
      await axios.get('https://www.asaas.com/api/v3/myAccount', {
        headers: { 'access_token': asaasApiKey },
      });
      results.asaas = true;
    } catch (error) {
      // Se der erro (ex: 401 Unauthorized), a chave é inválida
      results.asaas = false;
    }
  }

  // --- Teste da API de Consulta ---
  if (consultationApiKey) {
    try {
      // **IMPORTANTE**: Substitua pela URL e método de autenticação corretos da sua API de consulta
      // Exemplo: tentando acessar um endpoint de status com a chave no header
      await axios.get('https://api.suaconsulta.com/v1/status', { // URL DE EXEMPLO
        headers: { 'x-api-key': consultationApiKey },
      });
      results.consultation = true;
    } catch (error) { 
      results.consultation = false;
    }
  }

  res.json(results);
});

export default router;
