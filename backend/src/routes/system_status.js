import express from 'express';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// Rota para verificar o status das configurações essenciais do sistema
router.get('/', authenticateToken, isAdmin, (req, res) => {
  const status = {
    jwt_secret: !!process.env.JWT_SECRET,
    db_host: !!process.env.DB_HOST,
    db_user: !!process.env.DB_USER,
    db_password: !!process.env.DB_PASSWORD,
    db_name: !!process.env.DB_NAME,
    // Adicione aqui outras chaves de API externas que você venha a usar
    // ex: payment_gateway_key: !!process.env.PAYMENT_GATEWAY_KEY,
  };

  res.json(status);
});

export default router;
