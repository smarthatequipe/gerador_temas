/**
 * Serviço de Geração de Templates
 * Responsável por gerar templates completos com componentes e páginas
 * Utiliza o ComponentGenerator para criar cada componente individual
 */

const fs = require('fs').promises;
const path = require('path');
const ComponentGenerator = require('./componentGenerator');
const TemplatePrompts = require('./prompts');

class TemplateGenerator {
    constructor() {
        this.componentGenerator = new ComponentGenerator();
    }

    /**
     * Gera um template completo
     * @param {string} name - Nome do template
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @returns {Promise<Object>} Template gerado
     */
    async generateTemplate(name, niche, specifications = {}) {
        console.log(`Iniciando geração do template ${name} para nicho ${niche}`);
        
        try {
            const templatePath = path.join(process.cwd(), 'templates', name);
            await fs.mkdir(templatePath, { recursive: true });

            // Gerar componentes base
            const components = await this.generateBaseComponents(name, niche, specifications);
            
            // Gerar páginas
            const pages = await this.generatePages(name, niche, components, specifications);

            const template = {
                name,
                niche,
                components,
                pages,
                specifications,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Salvar metadados do template
            await fs.writeFile(
                path.join(templatePath, 'template.json'),
                JSON.stringify(template, null, 2)
            );

            console.log(`Template ${name} gerado com sucesso`);
            return template;
        } catch (error) {
            console.error(`Erro ao gerar template ${name}:`, error);
            throw error;
        }
    }

    /**
     * Gera os componentes base do template
     * @private
     */
    async generateBaseComponents(name, niche, specifications) {
        const components = {};
        const baseComponents = ['header', 'footer', 'navigation', 'sidebar'];

        for (const componentName of baseComponents) {
            console.log(`Gerando componente base ${componentName}`);
            components[componentName] = await this.componentGenerator.generateComponent(
                componentName,
                niche,
                specifications
            );

            // Salvar arquivos do componente
            const componentPath = path.join(process.cwd(), 'templates', name, 'components', componentName);
            await fs.mkdir(componentPath, { recursive: true });

            await Promise.all([
                fs.writeFile(path.join(componentPath, `${componentName}.html`), components[componentName].html),
                fs.writeFile(path.join(componentPath, `${componentName}.css`), components[componentName].css),
                fs.writeFile(path.join(componentPath, `${componentName}.js`), components[componentName].js)
            ]);
        }

        return components;
    }

    /**
     * Gera as páginas do template
     * @private
     */
    async generatePages(name, niche, components, specifications) {
        const pages = {};
        const requiredPages = ['home', 'about', 'contact', 'blog'];

        for (const pageName of requiredPages) {
            console.log(`Gerando página ${pageName}`);
            const prompts = TemplatePrompts.generatePagePrompts(pageName, niche, components, specifications);
            
            // Gerar cada parte da página
            const [html, css, js] = await Promise.all([
                this.generatePageHTML(prompts.html),
                this.generatePageCSS(prompts.css),
                this.generatePageJS(prompts.js)
            ]);

            // Adicionar estrutura básica ao HTML da página
            const fullHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageName} - ${name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    ${html}
    <script src="script.js"></script>
</body>
</html>`;

            pages[pageName] = { html: fullHTML, css, js };

            // Salvar arquivos da página
            const pagePath = path.join(process.cwd(), 'templates', name, 'pages', pageName);
            await fs.mkdir(pagePath, { recursive: true });

            await Promise.all([
                fs.writeFile(path.join(pagePath, `${pageName}.html`), fullHTML),
                fs.writeFile(path.join(pagePath, `${pageName}.css`), css),
                fs.writeFile(path.join(pagePath, `${pageName}.js`), js)
            ]);
        }

        return pages;
    }

    /**
     * Gera o HTML de uma página
     * @private
     */
    async generatePageHTML(prompt) {
        const response = await this.componentGenerator.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: "system",
                    content: "Você é um especialista em HTML semântico e acessibilidade. Retorne APENAS o conteúdo do body, sem tags html/head/body."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        return response.choices[0].message.content;
    }

    /**
     * Gera o CSS de uma página
     * @private
     */
    async generatePageCSS(prompt) {
        const response = await this.componentGenerator.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: "system",
                    content: "Você é um especialista em CSS moderno e responsivo. Retorne APENAS o código CSS, sem tags style."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        return response.choices[0].message.content;
    }

    /**
     * Gera o JavaScript de uma página
     * @private
     */
    async generatePageJS(prompt) {
        const response = await this.componentGenerator.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: "system",
                    content: "Você é um especialista em JavaScript moderno e modular. Retorne APENAS o código JavaScript, sem tags script."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        return response.choices[0].message.content;
    }
}

module.exports = TemplateGenerator; 