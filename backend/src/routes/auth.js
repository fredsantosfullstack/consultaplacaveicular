import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Rota de Registro
router.post('/register', async (req, res) => {
  const { name, email, password, documentType, documentNumber, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ msg: 'Por favor, inclua nome, e-mail e senha.' });
  try {
    const [existing] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ msg: 'Usuário já cadastrado.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { name, email, password: hashedPassword, document_type: documentType, document_number: documentNumber, phone };
    const [result] = await db.query('INSERT INTO users SET ?', newUser);
    res.status(201).json({ msg: 'Usuário registrado!', userId: result.insertId });
  } catch (err) { res.status(500).send('Erro no servidor'); }
});

// Rota de Login
router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Forneça e-mail e senha.' });
  try {
    console.log('🔐 Tentativa de login:', email);
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }
    const user = users[0];
    console.log('✅ Usuário encontrado:', email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Senha incorreta para:', email);
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }
    console.log('✅ Senha correta para:', email);
    const payload = { user: { id: user.id, role: user.role } };
    const secret = process.env.JWT_SECRET || 'seu_segredo_jwt_temporario';
    const options = { expiresIn: rememberMe ? '7d' : '24h' };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error('❌ Erro ao gerar JWT:', err);
        throw err;
      }
      console.log('✅ Login bem-sucedido para:', email);
      res.json({ token });
    });
  } catch (err) {
    console.error('❌ Erro no login:', err.message);
    res.status(500).json({ msg: 'Erro no servidor', error: err.message });
  }
});

// Rota para obter perfil do usuário logado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, phone, document_number, document_type, balance, role, avatar, company, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }
    res.json(users[0]);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Rota de Solicitação de Redefinição de Senha
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      const token = crypto.randomBytes(20).toString('hex');
      await db.query('INSERT INTO password_resets SET ?', { email, token });
      // TODO: Enviar e-mail com o link de redefinição
      console.log(`Link de reset (para teste): http://localhost:5174/resetar-senha?token=${token}`);
    }
    res.status(200).json({ msg: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' });
  } catch (err) { res.status(500).send('Erro no servidor'); }
});

// Rota de Redefinição de Senha
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ msg: 'Token e nova senha são obrigatórios.' });
  try {
    const [resets] = await db.query('SELECT * FROM password_resets WHERE token = ? AND created_at > NOW() - INTERVAL 1 HOUR', [token]);
    if (resets.length === 0) return res.status(400).json({ msg: 'Token inválido ou expirado.' });
    const { email } = resets[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    await db.query('DELETE FROM password_resets WHERE token = ?', [token]);
    res.json({ msg: 'Senha redefinida com sucesso!' });
  } catch (err) { res.status(500).send('Erro no servidor'); }
});

// Rota de Dados do Usuário
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, balance, document_number, company, created_at FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).send('Server Error');
  }
});

// Rota para alterar senha do usuário logado
router.put('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'Senha atual e nova senha são obrigatórias.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'A nova senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Busca o usuário e verifica a senha atual
    const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValidPassword) {
      return res.status(400).json({ msg: 'Senha atual incorreta.' });
    }

    // Criptografa a nova senha e atualiza
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    res.json({ msg: 'Senha alterada com sucesso!' });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ msg: 'Erro no servidor ao alterar senha.' });
  }
});

// Rota para o usuário logado atualizar seu próprio perfil
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, email, phone, recovery_email, document_number, company } = req.body;
  const userId = req.user.id;

  if (!name && !email && !phone && !recovery_email && !document_number && !company) {
    return res.status(400).json({ msg: 'Nenhum dado para atualizar.' });
  }

  try {
    // Verifica se o novo email já está em uso por outro usuário
    if (email) {
      const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
      if (existing.length > 0) {
        return res.status(400).json({ msg: 'Este e-mail já está em uso.' });
      }
    }

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (phone) fieldsToUpdate.phone = phone;
    if (recovery_email) fieldsToUpdate.recovery_email = recovery_email;
    if (document_number) fieldsToUpdate.document_number = document_number;
    if (company) fieldsToUpdate.company = company;
    
    await db.query('UPDATE users SET ? WHERE id = ?', [fieldsToUpdate, userId]);

    res.json({ msg: 'Perfil atualizado com sucesso!' });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar perfil.' });
  }
});


export default router;
