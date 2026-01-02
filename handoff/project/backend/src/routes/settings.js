import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authenticateToken from '../middleware/auth.js';
import db from '../config/db.js';

const router = express.Router();

// Middleware para verificar se o usuário é admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Acesso negado. Rota apenas para administradores.' });
  }
};

// Configuração de diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../public/assets');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para o logo do menu
const logoMenuStorage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `logo-golden-veicular-menu${extension}`); // Nome fixo
  }
});

const uploadLogoMenu = multer({ storage: logoMenuStorage });

// Configuração do Multer para o logo de login
const logoLoginStorage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `logo-golden-veicular-login${extension}`); // Nome fixo
  }
});

const uploadLogoLogin = multer({ storage: logoLoginStorage });

// Configuração do Multer para o favicon
const faviconStorage = multer.diskStorage({
  destination: path.join(__dirname, '../../public'), // Salva na raiz da pasta public
  filename: (req, file, cb) => {
    cb(null, 'favicon.ico'); // Nome fixo
  }
});

const uploadFavicon = multer({ storage: faviconStorage });

// Rota para upload do logo do menu
router.put('/logo-menu', authenticateToken, isAdmin, uploadLogoMenu.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Nenhum arquivo enviado.' });
  }
  res.json({ msg: 'Logo do menu atualizado com sucesso!', path: `/assets/${req.file.filename}` });
});

// Rota para upload do logo de login
router.put('/logo-login', authenticateToken, isAdmin, uploadLogoLogin.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Nenhum arquivo enviado.' });
  }
  res.json({ msg: 'Logo de login atualizado com sucesso!', path: `/assets/${req.file.filename}` });
});

// Rota para upload do favicon
router.put('/favicon', authenticateToken, isAdmin, uploadFavicon.single('favicon'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Nenhum arquivo enviado.' });
  }
  res.json({ msg: 'Favicon atualizado com sucesso!', path: `/${req.file.filename}` });
});

// Rota para buscar todas as configurações
router.get('/', async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM site_settings');
    // Transforma o array de objetos em um único objeto chave-valor
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar configurações.' });
  }
});

// Rota para salvar as configurações (apenas admin)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const settings = req.body; // Espera um objeto { key: value, ... }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    for (const key in settings) {
      if (Object.hasOwnProperty.call(settings, key)) {
        const value = settings[key];
        // O comando ON DUPLICATE KEY UPDATE insere se não existir, ou atualiza se já existir.
        await connection.query(
          'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, value, value]
        );
      }
    }

    await connection.commit();
    connection.release();

    res.json({ msg: 'Configurações salvas com sucesso!' });

  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    res.status(500).json({ msg: 'Erro no servidor ao salvar configurações.' });
  }
});

// ==================== ROTAS DE CONFIGURAÇÃO DA API ====================

// Buscar credenciais da API (apenas admin)
router.get('/api-credentials', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [settings] = await db.query(
      'SELECT setting_key, setting_value FROM api_settings WHERE setting_key IN (?, ?)',
      ['api_email', 'api_password']
    );
    
    const credentials = {
      api_email: '',
      api_password: ''
    };
    
    settings.forEach(setting => {
      credentials[setting.setting_key] = setting.setting_value;
    });
    
    res.json(credentials);
  } catch (error) {
    console.error('Erro ao buscar credenciais da API:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar credenciais da API.' });
  }
});

// Atualizar credenciais da API (apenas admin)
router.put('/api-credentials', authenticateToken, isAdmin, async (req, res) => {
  const { api_email, api_password } = req.body;

  if (!api_email || !api_password) {
    return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
  }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    // Atualizar email
    await connection.query(
      'INSERT INTO api_settings (setting_key, setting_value, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      ['api_email', api_email, 'Email para autenticação na API externa', api_email]
    );

    // Atualizar senha
    await connection.query(
      'INSERT INTO api_settings (setting_key, setting_value, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      ['api_password', api_password, 'Senha para autenticação na API externa', api_password]
    );

    await connection.commit();
    connection.release();

    res.json({ msg: 'Credenciais da API atualizadas com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar credenciais da API:', error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar credenciais da API.' });
  }
});

export default router;
