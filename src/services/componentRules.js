/**
 * Serviço de Regras de Componentes
 * Define as regras e estruturas para geração de componentes baseado no PRD
 * Garante que todos os componentes sigam os padrões de qualidade definidos
 */

class ComponentRules {
    constructor() {
        // Páginas obrigatórias conforme PRD
        this.requiredPages = [
            'sobre-nos',
            'contato',
            'blog',
            'politica-privacidade',
            'termos-adesao'
        ];

        // Componentes base obrigatórios
        this.baseComponents = [
            'header',
            'footer',
            'navigation',
            'hero',
            'card',
            'button',
            'form',
            'modal'
        ];

        // Regras de qualidade para componentes
        this.qualityRules = {
            seo: {
                title: 'Otimização para SEO',
                rules: [
                    'Usar tags semânticas HTML5',
                    'Incluir meta tags relevantes',
                    'Usar atributos alt em imagens',
                    'Implementar schema markup'
                ]
            },
            performance: {
                title: 'Otimização de Performance',
                rules: [
                    'Minificar CSS e JavaScript',
                    'Otimizar imagens',
                    'Usar lazy loading',
                    'Implementar cache'
                ]
            },
            accessibility: {
                title: 'Acessibilidade',
                rules: [
                    'Seguir WCAG 2.1',
                    'Usar ARIA attributes',
                    'Garantir contraste adequado',
                    'Suportar navegação por teclado'
                ]
            },
            responsiveness: {
                title: 'Responsividade',
                rules: [
                    'Usar media queries',
                    'Implementar mobile-first',
                    'Testar em diferentes dispositivos',
                    'Usar unidades relativas'
                ]
            }
        };

        // Estrutura padrão de componentes
        this.componentStructure = {
            html: {
                required: [
                    'doctype',
                    'html-tag',
                    'head-section',
                    'body-section',
                    'main-content'
                ],
                recommended: [
                    'semantic-tags',
                    'aria-attributes',
                    'meta-tags'
                ]
            },
            css: {
                required: [
                    'reset-normalize',
                    'variables',
                    'typography',
                    'layout',
                    'responsive'
                ],
                recommended: [
                    'animations',
                    'transitions',
                    'custom-properties'
                ]
            },
            javascript: {
                required: [
                    'error-handling',
                    'event-listeners',
                    'dom-manipulation'
                ],
                recommended: [
                    'modular-code',
                    'performance-optimization',
                    'accessibility-enhancements'
                ]
            }
        };
    }

    /**
     * Verifica se todas as páginas obrigatórias estão presentes
     * @param {string[]} pages - Lista de páginas a verificar
     * @returns {boolean} - True se todas as páginas obrigatórias estiverem presentes
     */
    validateRequiredPages(pages) {
        return this.requiredPages.every(page => pages.includes(page));
    }

    /**
     * Verifica se todos os componentes base estão presentes
     * @param {string[]} components - Lista de componentes a verificar
     * @returns {boolean} - True se todos os componentes base estiverem presentes
     */
    validateBaseComponents(components) {
        return this.baseComponents.every(component => components.includes(component));
    }

    /**
     * Gera o prompt para criação de um componente específico
     * @param {string} componentName - Nome do componente
     * @param {Object} params - Parâmetros do template
     * @returns {string} - Prompt formatado para a OpenAI
     */
    generateComponentPrompt(componentName, params) {
        const rules = this.getComponentRules(componentName);
        
        return `
            Crie um componente ${componentName} moderno e responsivo para um site com as seguintes características:
            
            Domínio: ${params.domain}
            Nicho: ${params.niche}
            Especificações: ${params.specifications}
            
            Regras de Qualidade:
            ${this.formatQualityRules(rules)}
            
            Estrutura do Componente:
            ${this.formatComponentStructure()}
            
            O componente deve ser:
            - Totalmente responsivo
            - Otimizado para SEO
            - Compatível com navegadores modernos
            - Fácil de manter e modificar
            - Acessível (WCAG 2.1)
            
            Por favor, forneça:
            1. Estrutura HTML completa com tags semânticas
            2. Estilos CSS modernos e responsivos
            3. JavaScript necessário para interatividade
            4. Comentários explicativos no código
        `;
    }

    /**
     * Obtém as regras específicas para um componente
     * @private
     */
    getComponentRules(componentName) {
        const rules = { ...this.qualityRules };
        
        // Adiciona regras específicas para cada tipo de componente
        switch (componentName) {
            case 'header':
                rules.seo.rules.push('navigation-structure');
                rules.accessibility.rules.push('skip-to-content');
                break;
            case 'footer':
                rules.seo.rules.push('footer-links');
                rules.accessibility.rules.push('footer-navigation');
                break;
            case 'navigation':
                rules.accessibility.rules.push('keyboard-navigation', 'aria-expanded');
                rules.responsiveness.rules.push('mobile-menu');
                break;
        }

        return rules;
    }

    /**
     * Formata as regras de qualidade para o prompt
     * @private
     */
    formatQualityRules(rules) {
        return Object.entries(rules)
            .map(([category, { title, rules: categoryRules }]) => `
                ${category.toUpperCase()}:
                ${title}:
                - Obrigatório: ${categoryRules.join(', ')}
            `)
            .join('\n');
    }

    /**
     * Formata a estrutura do componente para o prompt
     * @private
     */
    formatComponentStructure() {
        return Object.entries(this.componentStructure)
            .map(([type, structure]) => `
                ${type.toUpperCase()}:
                - Obrigatório: ${structure.required.join(', ')}
                - Recomendado: ${structure.recommended.join(', ')}
            `)
            .join('\n');
    }
}

module.exports = new ComponentRules(); 