/**
 * Serviço de Geração de Componentes
 * Responsável por gerar componentes individuais usando OpenAI
 * Garante consistência entre HTML, CSS e JavaScript
 */

const OpenAI = require('openai');
const TemplatePrompts = require('./prompts');
const path = require('path');
const fs = require('fs').promises;

class ComponentGenerator {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        // Classes base que devem ser incluídas em cada componente
        this.baseClasses = {
            header: [
                'header', 'header-nav', 'header-logo', 'header-menu', 
                'header-search', 'search-input', 'search-button',
                'visually-hidden', 'menu-toggle', 'nav-links'
            ],
            footer: [
                'footer', 'footer-content', 'footer-links', 'footer-social', 
                'footer-copyright', 'social-links', 'footer-nav',
                'visually-hidden'
            ],
            navigation: [
                'nav', 'nav-menu', 'nav-item', 'nav-link',
                'menu-toggle', 'nav-links', 'visually-hidden'
            ],
            sidebar: [
                'sidebar', 'sidebar-content', 'sidebar-menu', 
                'sidebar-item', 'sidebar-link', 'menu-toggle',
                'visually-hidden'
            ],
            gallery: [
                'gallery', 'gallery-grid', 'gallery-item',
                'gallery-image', 'gallery-caption', 'lightbox',
                'visually-hidden'
            ]
        };
    }

    /**
     * Gera um componente completo
     * @param {string} name - Nome do componente
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @returns {Promise<Object>} Componente gerado
     */
    async generateComponent(name, niche, specifications = {}) {
        try {
            console.log(`Iniciando geração do componente ${name} para nicho ${niche}`);
            
            // 1. Gerar HTML primeiro
            const html = await this.generateHTML(name, niche, specifications);
            
            // 2. Extrair classes e IDs do HTML
            const { classes, ids } = this.extractClassesAndIds(html);
            
            // 3. Adicionar classes base se necessário
            const allClasses = this.addBaseClasses(name, classes);
            
            // 4. Gerar CSS usando as classes e IDs extraídos
            const css = await this.generateCSS(name, niche, specifications, allClasses, ids);
            
            // 5. Gerar JavaScript usando as classes e IDs extraídos
            const js = await this.generateJS(name, niche, specifications, allClasses, ids);
            
            // 6. Validar consistência
            this.validateComponent(html, css, js, allClasses, ids);
            
            return {
                html,
                css,
                js
            };
        } catch (error) {
            console.error(`Erro ao gerar componente ${name}:`, error);
            throw error;
        }
    }

    /**
     * Adiciona classes base ao componente
     * @param {string} name - Nome do componente
     * @param {Array<string>} classes - Classes extraídas do HTML
     * @returns {Array<string>} Classes completas
     */
    addBaseClasses(name, classes) {
        const baseClasses = this.baseClasses[name] || [];
        const allClasses = [...new Set([...classes, ...baseClasses])];
        
        // Garantir que as classes base estejam presentes no HTML
        if (baseClasses.length > 0) {
            console.log(`Adicionando classes base para ${name}:`, baseClasses);
        }
        
        return allClasses;
    }

    /**
     * Extrai classes e IDs do HTML
     * @param {string} html - Código HTML
     * @returns {Object} Classes e IDs extraídos
     */
    extractClassesAndIds(html) {
        const classes = new Set();
        const ids = new Set();

        // Extrair classes
        const classMatches = html.match(/class="([^"]+)"/g) || [];
        classMatches.forEach(match => {
            const classList = match.replace(/class="/, '').replace(/"/, '').split(' ');
            classList.forEach(className => classes.add(className.trim()));
        });

        // Extrair IDs
        const idMatches = html.match(/id="([^"]+)"/g) || [];
        idMatches.forEach(match => {
            const id = match.replace(/id="/, '').replace(/"/, '');
            ids.add(id.trim());
        });

        return {
            classes: Array.from(classes),
            ids: Array.from(ids)
        };
    }

    /**
     * Gera o HTML do componente
     * @param {string} name - Nome do componente
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @returns {Promise<string>} HTML gerado
     */
    async generateHTML(name, niche, specifications) {
        const prompt = TemplatePrompts.generateHTMLPrompt(name, niche, specifications);
        
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Você é um especialista em desenvolvimento web. Gere HTML semântico e acessível.
Use as seguintes classes base: ${this.baseClasses[name]?.join(', ') || ''}`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        });

        return response.choices[0].message.content.trim();
    }

    /**
     * Gera o CSS do componente
     * @param {string} name - Nome do componente
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @param {Array<string>} classes - Classes a serem usadas
     * @param {Array<string>} ids - IDs a serem usados
     * @returns {Promise<string>} CSS gerado
     */
    async generateCSS(name, niche, specifications, classes, ids) {
        const prompt = TemplatePrompts.generateCSSPrompt(name, niche, specifications);
        
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Você é um especialista em CSS. Use as seguintes classes e IDs no seu CSS:
Classes: ${classes.join(', ')}
IDs: ${ids.join(', ')}
Certifique-se de incluir todas as classes base do componente.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        });

        return response.choices[0].message.content.trim();
    }

    /**
     * Gera o JavaScript do componente
     * @param {string} name - Nome do componente
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @param {Array<string>} classes - Classes a serem usadas
     * @param {Array<string>} ids - IDs a serem usados
     * @returns {Promise<string>} JavaScript gerado
     */
    async generateJS(name, niche, specifications, classes, ids) {
        const prompt = TemplatePrompts.generateJSPrompt(name, niche, specifications);
        
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Você é um especialista em JavaScript. Use as seguintes classes e IDs no seu código:
Classes: ${classes.join(', ')}
IDs: ${ids.join(', ')}
Certifique-se de incluir todas as classes base do componente.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        });

        return response.choices[0].message.content.trim();
    }

    /**
     * Valida a consistência do componente
     * @param {string} html - Código HTML
     * @param {string} css - Código CSS
     * @param {string} js - Código JavaScript
     * @param {Array<string>} classes - Classes esperadas
     * @param {Array<string>} ids - IDs esperados
     */
    validateComponent(html, css, js, classes, ids) {
        console.log('\n=== VALIDAÇÃO DE COMPONENTE ===');
        
        // Verificar classes no CSS
        const missingClasses = classes.filter(className => {
            const classRegex = new RegExp(`\\.${className}\\b`);
            return !classRegex.test(css);
        });

        if (missingClasses.length > 0) {
            console.warn('Classes não encontradas no CSS:', missingClasses);
        }

        // Verificar IDs no CSS
        const missingIds = ids.filter(id => {
            const idRegex = new RegExp(`#${id}\\b`);
            return !idRegex.test(css);
        });

        if (missingIds.length > 0) {
            console.warn('IDs não encontrados no CSS:', missingIds);
        }

        // Verificar classes no JavaScript
        const missingJsClasses = classes.filter(className => {
            const classRegex = new RegExp(`\\.${className}\\b`);
            return !classRegex.test(js);
        });

        if (missingJsClasses.length > 0) {
            console.warn('Classes não encontradas no JavaScript:', missingJsClasses);
        }

        // Verificar IDs no JavaScript
        const missingJsIds = ids.filter(id => {
            const idRegex = new RegExp(`#${id}\\b`);
            return !idRegex.test(js);
        });

        if (missingJsIds.length > 0) {
            console.warn('IDs não encontrados no JavaScript:', missingJsIds);
        }

        console.log('Validação concluída');
        console.log('=============================\n');
    }
}

module.exports = ComponentGenerator; 