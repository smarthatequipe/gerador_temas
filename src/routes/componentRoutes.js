/**
 * Rotas para gerenciamento de componentes
 * Responsável por todas as operações relacionadas a componentes de templates
 */

const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');

// Rota para criar um novo componente
router.post('/', componentController.createComponent);

// Rota para listar componentes de um template
router.get('/template/:templateId', componentController.listComponents);

// Rota para obter um componente específico
router.get('/:id', componentController.getComponent);

// Rota para atualizar um componente
router.put('/:id', componentController.updateComponent);

// Rota para aprovar um componente
router.post('/:id/approve', componentController.approveComponent);

// Rota para solicitar modificação de um componente
router.post('/:id/modify', componentController.requestModification);

module.exports = router; 