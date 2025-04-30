/**
 * Rotas de Preview
 * Define as rotas para visualização e gerenciamento de previews de templates
 */

const express = require('express');
const router = express.Router();
const previewController = require('../controllers/previewController');

// Visualizar um template
router.get('/template/:domain', previewController.showTemplate.bind(previewController));

// Aprovar um template
router.post('/template/:domain/approve', previewController.approveTemplate.bind(previewController));

// Modificar um template
router.post('/template/:domain/modify', previewController.modifyTemplate.bind(previewController));

module.exports = router; 