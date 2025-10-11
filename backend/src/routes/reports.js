import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// Rota para buscar dados para o dashboard de relatórios
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    // 1. Total de usuários
    const [usersResult] = await db.query('SELECT COUNT(id) as totalUsers FROM users');
    const totalUsers = usersResult[0].totalUsers;

    // 2. Faturamento total (soma dos valores de recarga)
    const [rechargeResult] = await db.query('SELECT SUM(amount) as totalRevenue FROM recharge_history WHERE status = \'approved\'');
    const totalRevenue = rechargeResult[0].totalRevenue || 0;

    // 3. Total de consultas realizadas
    const [consultationsResult] = await db.query('SELECT COUNT(id) as totalConsultations FROM consultation_history');
    const totalConsultations = consultationsResult[0].totalConsultations;

    res.json({
      totalUsers,
      totalRevenue,
      totalConsultations,
    });

  } catch (error) {
    console.error('Erro ao gerar relatórios:', error);
    res.status(500).json({ msg: 'Erro no servidor ao gerar relatórios.' });
  }
});

export default router;
