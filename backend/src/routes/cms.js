import express from 'express';
import * as cmsController from '../controllers/cmsController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

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
router.put('/config', authenticateToken, isAdmin, cmsController.updateConfig);

// Hero section
router.put('/hero', authenticateToken, isAdmin, cmsController.updateHero);

// Benefícios
router.post('/benefits', authenticateToken, isAdmin, cmsController.createBenefit);
router.put('/benefits/:id', authenticateToken, isAdmin, cmsController.updateBenefit);
router.delete('/benefits/:id', authenticateToken, isAdmin, cmsController.deleteBenefit);

// Estatísticas
router.put('/statistics/:id', authenticateToken, isAdmin, cmsController.updateStatistic);

// Serviços
router.post('/services', authenticateToken, isAdmin, cmsController.createService);
router.put('/services/:id', authenticateToken, isAdmin, cmsController.updateService);
router.delete('/services/:id', authenticateToken, isAdmin, cmsController.deleteService);

// Passos
router.put('/steps/:id', authenticateToken, isAdmin, cmsController.updateStep);

// Submissões de contato
router.get('/contact-submissions', authenticateToken, isAdmin, cmsController.getContactSubmissions);

export default router;
