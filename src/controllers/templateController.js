/**
 * Controlador para gerenciamento de templates
 * Responsável por criar, listar e gerenciar templates
 * Trabalha com arquivos de componentes ao invés de banco de dados
 */

const fs = require('fs').promises;
const path = require('path');
const TemplateGenerator = require('../services/templateGenerator');

// Criar um novo template
exports.createTemplate = async (req, res) => {
    console.log('\n=== CRIAÇÃO DE TEMPLATE ===');
    console.log(`[${new Date().toISOString()}] Iniciando criação de template`);
    console.log(`[${new Date().toISOString()}] Dados recebidos:`, req.body);

    try {
        const { domain, niche, specifications, pages, components } = req.body;

        console.log(`[${new Date().toISOString()}] Validando dados...`);
        if (!domain || !niche) {
            throw new Error('Domínio e nicho são obrigatórios');
        }

        console.log(`[${new Date().toISOString()}] Iniciando geração do template...`);
        const generator = new TemplateGenerator();
        await generator.generateTemplate(domain, niche, specifications, pages, components);

        console.log(`[${new Date().toISOString()}] Template gerado com sucesso`);
        console.log('=============================\n');

        res.redirect(`/preview/template/${domain}`);
    } catch (error) {
        console.error('\n=== ERRO NA CRIAÇÃO ===');
        console.error(`[${new Date().toISOString()}] Erro ao criar template:`, error);
        console.error('========================\n');
        res.status(500).json({ error: 'Erro ao criar template' });
    }
};

// Listar todos os templates
exports.listTemplates = async (req, res) => {
    console.log('\n=== LISTAGEM DE TEMPLATES ===');
    console.log(`[${new Date().toISOString()}] Iniciando listagem de templates`);

    try {
        const templatesDir = path.join(__dirname, '../../templates');
        console.log(`[${new Date().toISOString()}] Lendo diretório: ${templatesDir}`);
        
        const templates = await fs.readdir(templatesDir);
        console.log(`[${new Date().toISOString()}] Templates encontrados:`, templates);
        
        const templatesData = await Promise.all(templates.map(async (template) => {
            const templatePath = path.join(templatesDir, template);
            const stats = await fs.stat(templatePath);
            console.log(`[${new Date().toISOString()}] Processando template: ${template}`);
            
            return {
                name: template,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime,
                size: stats.size
            };
        }));
        
        console.log(`[${new Date().toISOString()}] Listagem concluída com sucesso`);
        console.log('===============================\n');
        
        res.json(templatesData);
    } catch (error) {
        console.error('\n=== ERRO NA LISTAGEM ===');
        console.error(`[${new Date().toISOString()}] Erro ao listar templates:`, error);
        console.error('=========================\n');
        res.status(500).json({ error: 'Erro ao listar templates' });
    }
};

// Obter um template específico
exports.getTemplate = async (req, res) => {
    try {
        const templateDir = path.join(__dirname, '../../templates', req.params.id);
        
        // Verificar se o template existe
        try {
            await fs.access(templateDir);
        } catch {
            return res.status(404).json({ error: 'Template não encontrado' });
        }

        // Ler a estrutura do template
        const template = {
            name: req.params.id,
            components: await this.readDirectory(path.join(templateDir, 'components')),
            pages: await this.readDirectory(path.join(templateDir, 'pages'))
        };

        res.json(template);
    } catch (error) {
        console.error('Erro ao obter template:', error);
        res.status(500).json({ error: 'Erro ao obter template' });
    }
};

// Atualizar um template
exports.updateTemplate = async (req, res) => {
    console.log('\n=== ATUALIZAÇÃO DE TEMPLATE ===');
    console.log(`[${new Date().toISOString()}] Iniciando atualização do template: ${req.params.domain}`);
    console.log(`[${new Date().toISOString()}] Dados recebidos:`, req.body);

    try {
        const { domain } = req.params;
        const { modifications } = req.body;
        
        console.log(`[${new Date().toISOString()}] Validando template...`);
        const templatePath = path.join(__dirname, '../../templates', domain);
        const exists = await fs.access(templatePath).then(() => true).catch(() => false);
        
        if (!exists) {
            throw new Error('Template não encontrado');
        }
        
        console.log(`[${new Date().toISOString()}] Aplicando modificações...`);
        for (const [component, content] of Object.entries(modifications)) {
            const componentPath = path.join(templatePath, 'components', component);
            console.log(`[${new Date().toISOString()}] Atualizando componente: ${component}`);
            
            await fs.writeFile(path.join(componentPath, `${component}.html`), content.html);
            await fs.writeFile(path.join(componentPath, `${component}.css`), content.css);
            if (content.js) {
                await fs.writeFile(path.join(componentPath, `${component}.js`), content.js);
            }
        }
        
        console.log(`[${new Date().toISOString()}] Template atualizado com sucesso`);
        console.log('================================\n');
        
        res.json({ success: true });
    } catch (error) {
        console.error('\n=== ERRO NA ATUALIZAÇÃO ===');
        console.error(`[${new Date().toISOString()}] Erro ao atualizar template:`, error);
        console.error('===========================\n');
        res.status(500).json({ error: 'Erro ao atualizar template' });
    }
};

// Deletar um template
exports.deleteTemplate = async (req, res) => {
    console.log('\n=== REMOÇÃO DE TEMPLATE ===');
    console.log(`[${new Date().toISOString()}] Iniciando remoção do template: ${req.params.domain}`);
    
    try {
        const { domain } = req.params;
        const templatePath = path.join(__dirname, '../../templates', domain);
        
        console.log(`[${new Date().toISOString()}] Verificando existência do template...`);
        const exists = await fs.access(templatePath).then(() => true).catch(() => false);
        
        if (!exists) {
            throw new Error('Template não encontrado');
        }
        
        console.log(`[${new Date().toISOString()}] Removendo template...`);
        await fs.rm(templatePath, { recursive: true, force: true });
        
        console.log(`[${new Date().toISOString()}] Template removido com sucesso`);
        console.log('============================\n');
        
        res.json({ success: true });
    } catch (error) {
        console.error('\n=== ERRO NA REMOÇÃO ===');
        console.error(`[${new Date().toISOString()}] Erro ao remover template:`, error);
        console.error('========================\n');
        res.status(500).json({ error: 'Erro ao remover template' });
    }
};

// Função auxiliar para ler um diretório
async function readDirectory(dir) {
    try {
        const files = await fs.readdir(dir);
        return files.map(file => ({
            name: file,
            path: path.join(dir, file)
        }));
    } catch {
        return [];
    }
} 