/**
 * Rotas de Template
 * Gerencia as rotas relacionadas à criação e gerenciamento de templates
 */

const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Rota para exibir o formulário de criação
router.get('/new', (req, res) => {
    res.render('template-form', { title: 'Criar Novo Template' });
});

// Rota para criar novo template
router.post('/new', templateController.createTemplate);

// Rota para listar templates
router.get('/', templateController.listTemplates);

// Rota para obter um template específico
router.get('/:id', templateController.getTemplate);

// Rota para atualizar um template
router.put('/:id', templateController.updateTemplate);

// Rota para deletar um template
router.delete('/:id', templateController.deleteTemplate);

module.exports = router; 