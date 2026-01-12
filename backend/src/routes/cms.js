import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import * as cmsController from '../controllers/cmsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const heroAssetsDir = path.join(__dirname, '../../public/assets/hero');
const configAssetsDir = path.join(__dirname, '../../public/assets/config');

[heroAssetsDir, configAssetsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const heroIconStorage = multer.diskStorage({
  destination: heroAssetsDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `hero-whatsapp-icon${extension}`);
  }
});

const heroMockupStorage = multer.diskStorage({
  destination: heroAssetsDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `hero-mockup${extension}`);
  }
});

const allowedHeroAssetExtensions = ['.png', '.svg', '.webp'];

const heroAssetFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedHeroAssetExtensions.includes(ext)) {
    return cb(new Error('Formato de arquivo não suportado. Use PNG, SVG ou WEBP.'));
  }
  cb(null, true);
};

const heroIconUpload = multer({
  storage: heroIconStorage,
  fileFilter: heroAssetFileFilter
});

const heroMockupUpload = multer({
  storage: heroMockupStorage,
  fileFilter: heroAssetFileFilter
});

const allowedConfigAssetExtensions = ['.png', '.svg', '.webp', '.jpg', '.jpeg', '.ico', '.gif'];
const configAssetFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedConfigAssetExtensions.includes(ext)) {
    return cb(new Error('Formato de arquivo não suportado. Use PNG, SVG, WEBP, JPG, JPEG, GIF ou ICO.'));
  }
  cb(null, true);
};

const createConfigStorage = (fileName) => multer.diskStorage({
  destination: configAssetsDir,
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `${fileName}${extension}`);
  }
});

const configLogoUpload = multer({
  storage: createConfigStorage('site-logo'),
  fileFilter: configAssetFileFilter
});

const configFaviconUpload = multer({
  storage: createConfigStorage('site-favicon'),
  fileFilter: configAssetFileFilter
});

const configFooterLogoUpload = multer({
  storage: createConfigStorage('site-footer-logo'),
  fileFilter: configAssetFileFilter
});

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Acesso negado. Apenas administradores.' });
  }
};

// ========================================
// ROTAS PÚBLICAS (sem autenticação)
// ========================================

// Obter todos os dados da landing page (público)
router.get('/landing-page', cmsController.getLandingPageData);

// Obter configurações gerais (público)
router.get('/config', cmsController.getConfig);

// Obter hero (público)
router.get('/hero', cmsController.getHero);

// Obter benefícios (público)
router.get('/benefits', cmsController.getBenefits);

// Obter estatísticas (público)
router.get('/statistics', cmsController.getStatistics);

// Obter serviços (público)
router.get('/services', cmsController.getServices);

// Obter passos (público)
router.get('/steps', cmsController.getSteps);

// Obter links do rodapé (público)
router.get('/footer-links', cmsController.getFooterLinks);

// Enviar formulário de contato (público)
router.post('/contact', cmsController.submitContact);

// ========================================
// ROTAS PROTEGIDAS (apenas admin)
// ========================================

// Configurações gerais
router.put('/config', auth, isAdmin, cmsController.updateConfig);
router.put('/config/logo', auth, isAdmin, configLogoUpload.single('asset'), cmsController.updateLogoAsset);
router.put('/config/favicon', auth, isAdmin, configFaviconUpload.single('asset'), cmsController.updateFaviconAsset);
router.put('/config/footer-logo', auth, isAdmin, configFooterLogoUpload.single('asset'), cmsController.updateFooterLogoAsset);

// Hero section
router.put('/hero', auth, isAdmin, cmsController.updateHero);
router.put('/hero/icon', auth, isAdmin, heroIconUpload.single('icon'), cmsController.updateHeroIcon);
router.put('/hero/mockup', auth, isAdmin, heroMockupUpload.single('mockup'), cmsController.updateHeroMockup);

// Benefícios
router.post('/benefits', auth, isAdmin, cmsController.createBenefit);
router.put('/benefits/:id', auth, isAdmin, cmsController.updateBenefit);
router.delete('/benefits/:id', auth, isAdmin, cmsController.deleteBenefit);

// Estatísticas
router.put('/statistics/:id', auth, isAdmin, cmsController.updateStatistic);

// Serviços
router.post('/services', auth, isAdmin, cmsController.createService);
router.put('/services/:id', auth, isAdmin, cmsController.updateService);
router.delete('/services/:id', auth, isAdmin, cmsController.deleteService);

// Passos
router.put('/steps/:id', auth, isAdmin, cmsController.updateStep);

// Submissões de contato
router.get('/contact-submissions', auth, isAdmin, cmsController.getContactSubmissions);

export default router;
