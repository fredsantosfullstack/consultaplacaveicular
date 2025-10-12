import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que o diretório de uploads exista
const uploadDir = path.join(__dirname, '../../public/uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.params.id || req.user.id;
    const extension = path.extname(file.originalname);
    cb(null, `${userId}${extension}`);
  }
});

const upload = multer({ storage });

// Rota para buscar todos os usuários (apenas admin)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, balance, created_at, avatar FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar usuários.' });
  }
});

// Rota para upload de avatar
router.put('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Nenhum arquivo enviado.' });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  try {
    // Atualiza a URL do avatar no banco de dados
    await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, req.user.id]);

    res.json({ msg: 'Avatar atualizado com sucesso!', avatar_url: avatarUrl });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar avatar.' });
  }
});

// Rota para atualizar um usuário (apenas admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, balance } = req.body;

  // Validação básica
  if (!role && balance === undefined) {
    return res.status(400).json({ msg: 'Pelo menos um campo (role ou balance) deve ser fornecido.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const userToUpdate = users[0];
    const updatedFields = {
      role: role !== undefined ? role : userToUpdate.role,
      balance: balance !== undefined ? parseFloat(balance) : userToUpdate.balance,
    };

    await db.query('UPDATE users SET ? WHERE id = ?', [updatedFields, id]);

    res.json({ msg: 'Usuário atualizado com sucesso!', ...updatedFields });

  } catch (error) {
    console.error(`Erro ao atualizar usuário ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar usuário.' });
  }
});

// Rota para criar um novo usuário (apenas admin)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, email, password, role, balance, document_type, document_number, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    const [existing] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'Usuário com este e-mail já existe.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      balance: balance || 0,
      document_type,
      document_number,
      phone
    };

    const [result] = await db.query('INSERT INTO users SET ?', newUser);
    res.status(201).json({ id: result.insertId, ...newUser });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ msg: 'Erro no servidor ao criar usuário.' });
  }
});

// Rota para deletar um usuário (apenas admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  // Prevenção: não permitir que o admin se auto-delete
  if (req.user.id === parseInt(id, 10)) {
    return res.status(400).json({ msg: 'Você não pode excluir a si mesmo.' });
  }

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }
    res.json({ msg: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error(`Erro ao deletar usuário ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao deletar usuário.' });
  }
});

// Rota para admin fazer upload de avatar para um usuário específico
router.post('/:id/avatar', authenticateToken, isAdmin, upload.single('avatar'), async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ msg: 'Nenhum arquivo enviado.' });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  try {
    await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, id]);
    res.json({ msg: 'Avatar atualizado com sucesso!', avatar_url: avatarUrl });
  } catch (error) {
    console.error(`Erro ao atualizar avatar para o usuário ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar avatar.' });
  }
});

// Rota para usuário excluir seu próprio avatar
router.delete('/avatar', authenticateToken, async (req, res) => {
  try {
    // Buscar avatar atual
    const [users] = await db.query('SELECT avatar FROM users WHERE id = ?', [req.user.id]);
    if (users.length > 0 && users[0].avatar) {
      const avatarPath = path.join(__dirname, '../../public', users[0].avatar);
      // Tentar deletar o arquivo físico
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Remover avatar do banco
    await db.query('UPDATE users SET avatar = NULL WHERE id = ?', [req.user.id]);
    res.json({ msg: 'Avatar excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir avatar:', error);
    res.status(500).json({ msg: 'Erro no servidor ao excluir avatar.' });
  }
});

// Rota para admin excluir avatar de um usuário específico
router.delete('/:id/avatar', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar avatar atual
    const [users] = await db.query('SELECT avatar FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    if (users[0].avatar) {
      const avatarPath = path.join(__dirname, '../../public', users[0].avatar);
      // Tentar deletar o arquivo físico
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Remover avatar do banco
    await db.query('UPDATE users SET avatar = NULL WHERE id = ?', [id]);
    res.json({ msg: 'Avatar excluído com sucesso!' });
  } catch (error) {
    console.error(`Erro ao excluir avatar do usuário ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao excluir avatar.' });
  }
});

export default router;
