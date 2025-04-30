/**
 * Controlador de Preview
 * Responsável por gerenciar a visualização dos templates
 * Fornece métodos para visualizar e aprovar templates
 */

const path = require('path');
const fs = require('fs').promises;
const Template = require('../models/Template');

class PreviewController {
    /**
     * Renderiza a página de preview de um template
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    async showTemplate(req, res) {
        console.log('\n=== VISUALIZAÇÃO DE TEMPLATE ===');
        console.log(`[${new Date().toISOString()}] Iniciando visualização do template: ${req.params.domain}`);
        
        try {
            const { domain } = req.params;
            const templatePath = path.join(__dirname, '../../templates', domain);
            
            console.log(`[${new Date().toISOString()}] Verificando existência do template...`);
            const exists = await fs.access(templatePath).then(() => true).catch(() => false);
            
            if (!exists) {
                throw new Error('Template não encontrado');
            }
            
            console.log(`[${new Date().toISOString()}] Lendo estrutura do template...`);
            
            // Ler metadados do template
            const templateMetadata = JSON.parse(
                await fs.readFile(path.join(templatePath, 'template.json'), 'utf8')
            );
            
            // Ler componentes e páginas
            const components = await fs.readdir(path.join(templatePath, 'components'))
                .catch(() => []);
            const pages = await fs.readdir(path.join(templatePath, 'pages'))
                .catch(() => []);
            
            console.log(`[${new Date().toISOString()}] Componentes encontrados:`, components);
            console.log(`[${new Date().toISOString()}] Páginas encontradas:`, pages);
            
            // Construir objeto do template
            const template = {
                name: domain,
                ...templateMetadata,
                components,
                pages
            };
            
            console.log(`[${new Date().toISOString()}] Renderizando página de preview...`);
            console.log('==================================\n');
            
            res.render('preview', { template });
        } catch (error) {
            console.error('\n=== ERRO NA VISUALIZAÇÃO ===');
            console.error(`[${new Date().toISOString()}] Erro ao visualizar template:`, error);
            console.error('============================\n');
            res.status(500).render('error', {
                message: 'Erro ao visualizar template',
                error: error.message
            });
        }
    }

    /**
     * Lê os componentes de um template
     * @private
     */
    async readComponents(templateDir) {
        const componentsDir = path.join(templateDir, 'components');
        const components = {};

        try {
            console.log(`[${new Date().toISOString()}] Lendo diretório de componentes: ${componentsDir}`);
            const componentDirs = await fs.readdir(componentsDir);
            
            for (const component of componentDirs) {
                console.log(`[${new Date().toISOString()}] Processando componente: ${component}`);
                const componentPath = path.join(componentsDir, component);
                components[component] = {
                    html: await fs.readFile(path.join(componentPath, `${component}.html`), 'utf8'),
                    css: await fs.readFile(path.join(componentPath, `${component}.css`), 'utf8')
                };

                try {
                    components[component].js = await fs.readFile(
                        path.join(componentPath, `${component}.js`),
                        'utf8'
                    );
                } catch {
                    console.log(`[${new Date().toISOString()}] JavaScript não encontrado para o componente: ${component}`);
                }
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Erro ao ler componentes:`, error);
        }

        return components;
    }

    /**
     * Lê as páginas de um template
     * @private
     */
    async readPages(templateDir) {
        const pagesDir = path.join(templateDir, 'pages');
        const pages = {};

        try {
            console.log(`[${new Date().toISOString()}] Lendo diretório de páginas: ${pagesDir}`);
            const pageDirs = await fs.readdir(pagesDir);
            
            for (const page of pageDirs) {
                console.log(`[${new Date().toISOString()}] Processando página: ${page}`);
                const pagePath = path.join(pagesDir, page);
                pages[page] = {
                    html: await fs.readFile(path.join(pagePath, `${page}.html`), 'utf8'),
                    css: await fs.readFile(path.join(pagePath, `${page}.css`), 'utf8')
                };

                try {
                    pages[page].js = await fs.readFile(
                        path.join(pagePath, `${page}.js`),
                        'utf8'
                    );
                } catch {
                    console.log(`[${new Date().toISOString()}] JavaScript não encontrado para a página: ${page}`);
                }
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Erro ao ler páginas:`, error);
        }

        return pages;
    }

    /**
     * Aprova um template
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    async approveTemplate(req, res) {
        const { domain } = req.params;
        console.log(`[${new Date().toISOString()}] Iniciando aprovação do template: ${domain}`);

        try {
            await Template.update(domain, { status: 'approved' });
            console.log(`[${new Date().toISOString()}] Template aprovado com sucesso: ${domain}`);
            res.json({ success: true });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Erro ao aprovar template ${domain}:`, error);
            res.status(500).json({ error: 'Falha ao aprovar template' });
        }
    }

    /**
     * Modifica um template
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    async modifyTemplate(req, res) {
        const { domain } = req.params;
        console.log(`[${new Date().toISOString()}] Iniciando modificação do template: ${domain}`);

        try {
            const { modifications } = req.body;
            console.log(`[${new Date().toISOString()}] Modificações recebidas:`, Object.keys(modifications));

            // Atualizar os arquivos do template com as modificações
            const templateDir = path.join(__dirname, '../../templates', domain);
            
            for (const [component, content] of Object.entries(modifications)) {
                console.log(`[${new Date().toISOString()}] Atualizando componente: ${component}`);
                const componentPath = path.join(templateDir, 'components', component);
                await fs.writeFile(path.join(componentPath, `${component}.html`), content.html);
                await fs.writeFile(path.join(componentPath, `${component}.css`), content.css);
                if (content.js) {
                    await fs.writeFile(path.join(componentPath, `${component}.js`), content.js);
                }
            }

            await Template.update(domain, { status: 'modified' });
            console.log(`[${new Date().toISOString()}] Template modificado com sucesso: ${domain}`);
            res.json({ success: true });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Erro ao modificar template ${domain}:`, error);
            res.status(500).json({ error: 'Falha ao modificar template' });
        }
    }

    /**
     * Obtém o conteúdo de um componente
     */
    async getComponentContent(req, res) {
        console.log('\n=== OBTENÇÃO DE COMPONENTE ===');
        console.log(`[${new Date().toISOString()}] Iniciando obtenção do componente: ${req.params.component}`);
        console.log(`[${new Date().toISOString()}] Template: ${req.params.domain}`);
        
        try {
            const { domain, component } = req.params;
            const componentPath = path.join(__dirname, '../../templates', domain, 'components', component);
            
            console.log(`[${new Date().toISOString()}] Verificando existência do componente...`);
            const exists = await fs.access(componentPath).then(() => true).catch(() => false);
            
            if (!exists) {
                throw new Error('Componente não encontrado');
            }
            
            console.log(`[${new Date().toISOString()}] Lendo arquivos do componente...`);
            const html = await fs.readFile(path.join(componentPath, `${component}.html`), 'utf8');
            const css = await fs.readFile(path.join(componentPath, `${component}.css`), 'utf8');
            
            let js = '';
            try {
                js = await fs.readFile(path.join(componentPath, `${component}.js`), 'utf8');
            } catch (error) {
                console.log(`[${new Date().toISOString()}] Arquivo JavaScript não encontrado para o componente`);
            }
            
            console.log(`[${new Date().toISOString()}] Componente obtido com sucesso`);
            console.log('===============================\n');
            
            res.json({ html, css, js });
        } catch (error) {
            console.error('\n=== ERRO NA OBTENÇÃO ===');
            console.error(`[${new Date().toISOString()}] Erro ao obter componente:`, error);
            console.error('========================\n');
            res.status(500).json({ error: 'Erro ao obter componente' });
        }
    }

    /**
     * Obtém o conteúdo de uma página
     */
    async getPageContent(req, res) {
        console.log('\n=== OBTENÇÃO DE PÁGINA ===');
        console.log(`[${new Date().toISOString()}] Iniciando obtenção da página: ${req.params.page}`);
        console.log(`[${new Date().toISOString()}] Template: ${req.params.domain}`);
        
        try {
            const { domain, page } = req.params;
            const pagePath = path.join(__dirname, '../../templates', domain, 'pages', page);
            
            console.log(`[${new Date().toISOString()}] Verificando existência da página...`);
            const exists = await fs.access(pagePath).then(() => true).catch(() => false);
            
            if (!exists) {
                throw new Error('Página não encontrada');
            }
            
            console.log(`[${new Date().toISOString()}] Lendo arquivos da página...`);
            const html = await fs.readFile(path.join(pagePath, `${page}.html`), 'utf8');
            const css = await fs.readFile(path.join(pagePath, `${page}.css`), 'utf8');
            
            let js = '';
            try {
                js = await fs.readFile(path.join(pagePath, `${page}.js`), 'utf8');
            } catch (error) {
                console.log(`[${new Date().toISOString()}] Arquivo JavaScript não encontrado para a página`);
            }
            
            console.log(`[${new Date().toISOString()}] Página obtida com sucesso`);
            console.log('===========================\n');
            
            res.json({ html, css, js });
        } catch (error) {
            console.error('\n=== ERRO NA OBTENÇÃO ===');
            console.error(`[${new Date().toISOString()}] Erro ao obter página:`, error);
            console.error('========================\n');
            res.status(500).json({ error: 'Erro ao obter página' });
        }
    }
}

module.exports = new PreviewController(); 