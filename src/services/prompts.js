/**
 * Prompts para Geração de Templates
 * Centraliza todos os prompts usados na geração de templates e componentes
 * Utiliza o modelo gpt-4o-mini da OpenAI
 */

class TemplatePrompts {
    /**
     * Gera o prompt para criação de um template completo
     * @param {Object} params - Parâmetros do template
     * @param {string} params.domain - Domínio do site
     * @param {string} params.niche - Nicho do site
     * @param {string} params.specifications - Especificações adicionais
     * @returns {string} - Prompt formatado
     */
    static generateTemplatePrompt(params) {
        return `
            Crie um template moderno e responsivo para um site com as seguintes características:

            Domínio: ${params.domain}
            Nicho: ${params.niche}
            Especificações: ${params.specifications}

            O template deve seguir as seguintes diretrizes:

            1. Estrutura:
               - Layout responsivo e moderno
               - Sistema de grid flexível
               - Componentes modulares
               - Arquitetura de arquivos organizada

            2. Design:
               - Interface limpa e profissional
               - Paleta de cores adequada ao nicho
               - Tipografia legível e moderna
               - Espaçamento consistente
               - Animações sutis e funcionais

            3. Performance:
               - Código otimizado
               - Imagens otimizadas
               - Carregamento progressivo
               - Cache eficiente
               - Minificação de recursos

            4. SEO:
               - Estrutura semântica HTML5
               - Meta tags otimizadas
               - Schema markup
               - URLs amigáveis
               - Sitemap

            5. Acessibilidade:
               - WCAG 2.1 AA
               - Navegação por teclado
               - Contraste adequado
               - Textos alternativos
               - ARIA attributes

            6. Responsividade:
               - Mobile-first
               - Breakpoints adequados
               - Imagens responsivas
               - Touch-friendly
               - Performance mobile

            Por favor, forneça:
            1. Estrutura completa do projeto
            2. Arquivos de configuração
            3. Componentes base
            4. Páginas principais
            5. Documentação básica
        `;
    }

    /**
     * Gera o prompt para o HTML de um componente
     * @param {string} name - Nome do componente
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @returns {string} Prompt formatado
     */
    static generateHTMLPrompt(name, niche, specifications) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - ${niche}</title>
    <link rel="stylesheet" href="/css/normalize.css">
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="/components/${name}/${name}.css">
</head>
<body>
    <div class="component-${name}" id="${name}-component" data-component="${name}">
        ${name === 'header' ? `
        <header class="site-header">
            <div class="header-container">
                <div class="header-logo">
                    <a href="/" class="logo-link">
                        <img src="/images/logo.svg" alt="Logo ${niche}" class="logo-image">
                    </a>
                </div>
                <nav class="header-nav">
                    <button class="menu-toggle" aria-label="Menu">
                        <span class="menu-icon"></span>
                    </button>
                    <ul class="nav-list">
                        <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                        <li class="nav-item"><a href="/sobre" class="nav-link">Sobre</a></li>
                        <li class="nav-item"><a href="/servicos" class="nav-link">Serviços</a></li>
                        <li class="nav-item"><a href="/contato" class="nav-link">Contato</a></li>
                    </ul>
                </nav>
                <div class="header-search">
                    <form class="search-form">
                        <input type="search" class="search-input" placeholder="Buscar...">
                        <button type="submit" class="search-button">Buscar</button>
                    </form>
                </div>
            </div>
        </header>` : ''}
        ${name === 'footer' ? `
        <footer class="site-footer">
            <div class="footer-container">
                <div class="footer-content">
                    <div class="footer-info">
                        <h3 class="footer-title">Sobre Nós</h3>
                        <p class="footer-description">Descrição sobre ${niche}</p>
                    </div>
                    <div class="footer-links">
                        <h3 class="footer-title">Links Rápidos</h3>
                        <ul class="footer-nav">
                            <li><a href="/politica-privacidade">Política de Privacidade</a></li>
                            <li><a href="/termos">Termos de Uso</a></li>
                        </ul>
                    </div>
                    <div class="footer-contact">
                        <h3 class="footer-title">Contato</h3>
                        <ul class="contact-list">
                            <li><a href="mailto:contato@${niche}.com.br">contato@${niche}.com.br</a></li>
                            <li>Telefone: (11) 9999-9999</li>
                        </ul>
                    </div>
                    <div class="footer-social">
                        <h3 class="footer-title">Redes Sociais</h3>
                        <div class="social-links">
                            <a href="#" class="social-link" aria-label="Facebook">Facebook</a>
                            <a href="#" class="social-link" aria-label="Instagram">Instagram</a>
                            <a href="#" class="social-link" aria-label="LinkedIn">LinkedIn</a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p class="copyright">© ${new Date().getFullYear()} ${niche}. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>` : ''}
    </div>
    <script src="/js/utils.js"></script>
    <script src="/components/${name}/${name}.js"></script>
</body>
</html>`;
    }

    /**
     * Gera o prompt para o CSS de um componente
     * @param {string} name - Nome do componente
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @returns {string} Prompt formatado
     */
    static generateCSSPrompt(name, niche, specifications) {
        return `:root {
    --color-primary: #007bff;
    --color-secondary: #6c757d;
    --color-success: #28a745;
    --color-info: #17a2b8;
    --color-warning: #ffc107;
    --color-danger: #dc3545;
    --color-light: #f8f9fa;
    --color-dark: #343a40;
    --color-white: #ffffff;
    --color-black: #000000;
    
    --font-primary: 'Segoe UI', system-ui, -apple-system, sans-serif;
    --font-secondary: 'Georgia', serif;
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
    
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

.component-${name} {
    width: 100%;
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    font-family: var(--font-primary);
}

${name === 'header' ? `
.site-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--color-white);
    box-shadow: var(--shadow-sm);
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    max-width: var(--container-width);
    margin: 0 auto;
}

.header-logo {
    flex: 0 0 auto;
}

.logo-link {
    display: block;
    text-decoration: none;
}

.logo-image {
    height: 40px;
    width: auto;
}

.header-nav {
    flex: 1 1 auto;
    margin: 0 var(--spacing-lg);
}

.nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--spacing-md);
}

.nav-item {
    position: relative;
}

.nav-link {
    color: var(--color-dark);
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    transition: var(--transition-fast);
}

.nav-link:hover {
    color: var(--color-primary);
    background: var(--color-light);
}

.header-search {
    flex: 0 0 auto;
}

.search-form {
    display: flex;
    gap: var(--spacing-sm);
}

.search-input {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius-sm);
    min-width: 200px;
}

.search-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: var(--transition-fast);
}

.search-button:hover {
    background: var(--color-primary-dark);
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    padding: var(--spacing-sm);
    cursor: pointer;
}

.menu-icon {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-dark);
    position: relative;
    transition: var(--transition-fast);
}

.menu-icon::before,
.menu-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--color-dark);
    transition: var(--transition-fast);
}

.menu-icon::before {
    top: -6px;
}

.menu-icon::after {
    bottom: -6px;
}

@media (max-width: 768px) {
    .menu-toggle {
        display: block;
    }

    .nav-list {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: var(--color-white);
        flex-direction: column;
        padding: var(--spacing-md);
        box-shadow: var(--shadow-md);
    }

    .nav-list.active {
        display: flex;
    }

    .header-search {
        display: none;
    }
}` : ''}

${name === 'footer' ? `
.site-footer {
    background: var(--color-dark);
    color: var(--color-light);
    padding: var(--spacing-xl) 0;
}

.footer-container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
}

.footer-info,
.footer-links,
.footer-contact,
.footer-social {
    padding: var(--spacing-md);
}

.footer-title {
    color: var(--color-white);
    font-size: 1.25rem;
    margin-bottom: var(--spacing-md);
}

.footer-description {
    line-height: 1.6;
}

.footer-nav,
.contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-nav li,
.contact-list li {
    margin-bottom: var(--spacing-sm);
}

.footer-nav a,
.contact-list a {
    color: var(--color-light);
    text-decoration: none;
    transition: var(--transition-fast);
}

.footer-nav a:hover,
.contact-list a:hover {
    color: var(--color-primary);
}

.social-links {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.social-link {
    color: var(--color-light);
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-light);
    border-radius: var(--border-radius-sm);
    transition: var(--transition-fast);
}

.social-link:hover {
    background: var(--color-light);
    color: var(--color-dark);
}

.footer-bottom {
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--color-secondary);
    text-align: center;
}

.copyright {
    margin: 0;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
    }
}` : ''}

@media (max-width: 1200px) {
    .component-${name} {
        padding: 0 var(--spacing-md);
    }
}

@media (max-width: 768px) {
    .component-${name} {
        padding: 0 var(--spacing-sm);
    }
}`;
    }

    /**
     * Gera o prompt para o JavaScript de um componente
     * @param {string} name - Nome do componente
     * @param {string} niche - Nicho do template
     * @param {Object} specifications - Especificações adicionais
     * @returns {string} Prompt formatado
     */
    static generateJSPrompt(name, niche, specifications) {
        return `class ${name}Component {
    constructor() {
        this.component = document.getElementById('${name}-component');
        this.init();
    }

    init() {
        if (!this.component) return;
        this.initializeElements();
        this.setupEventListeners();
        console.log('${name} component initialized');
    }

    initializeElements() {
        this.elements = {
            ${name === 'header' ? `
            container: this.component.querySelector('.header-container'),
            logo: this.component.querySelector('.header-logo'),
            nav: this.component.querySelector('.header-nav'),
            menuToggle: this.component.querySelector('.menu-toggle'),
            navList: this.component.querySelector('.nav-list'),
            searchForm: this.component.querySelector('.search-form'),
            searchInput: this.component.querySelector('.search-input'),
            searchButton: this.component.querySelector('.search-button')` : ''}
            ${name === 'footer' ? `
            container: this.component.querySelector('.footer-container'),
            content: this.component.querySelector('.footer-content'),
            socialLinks: this.component.querySelectorAll('.social-link')` : ''}
        };
    }

    setupEventListeners() {
        ${name === 'header' ? `
        if (this.elements.menuToggle) {
            this.elements.menuToggle.addEventListener('click', () => {
                this.elements.navList.classList.toggle('active');
            });
        }

        if (this.elements.searchForm) {
            this.elements.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }` : ''}

        ${name === 'footer' ? `
        if (this.elements.socialLinks) {
            this.elements.socialLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSocialClick(e.target.textContent);
                });
            });
        }` : ''}
    }

    ${name === 'header' ? `
    handleSearch() {
        const searchTerm = this.elements.searchInput.value;
        console.log('Realizando busca:', searchTerm);
    }` : ''}

    ${name === 'footer' ? `
    handleSocialClick(network) {
        console.log('Clique em rede social:', network);
    }` : ''}
}

document.addEventListener('DOMContentLoaded', () => {
    new ${name}Component();
});`;
    }

    /**
     * Gera o prompt para uma página completa
     * @param {string} name - Nome da página
     * @param {string} niche - Nicho do template
     * @param {Object} components - Componentes disponíveis
     * @param {Object} specifications - Especificações adicionais
     * @returns {Object} Prompts formatados para HTML, CSS e JS
     */
    static generatePagePrompts(name, niche, components, specifications) {
        const componentsList = Object.keys(components);
        
        return {
            html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${name} - ${niche}">
    <title>${name} - ${niche}</title>
    <link rel="stylesheet" href="/css/normalize.css">
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="/pages/${name}/${name}.css">
    ${componentsList.map(comp => `<link rel="stylesheet" href="/components/${comp}/${comp}.css">`).join('\n    ')}
</head>
<body class="page-${name}" id="${name}-page">
    <header class="site-header" id="main-header"></header>
    <nav class="main-nav" id="main-nav"></nav>
    <main class="main-content" id="main-content">
        <div class="${name}-container">
            <section class="${name}-section">
                <h1>${name}</h1>
                <div class="${name}-content"></div>
            </section>
        </div>
    </main>
    <footer class="site-footer" id="main-footer"></footer>

    <script src="/js/utils.js"></script>
    <script src="/pages/${name}/${name}.js"></script>
    ${componentsList.map(comp => `<script src="/components/${comp}/${comp}.js"></script>`).join('\n    ')}
</body>
</html>`,

            css: `:root {
    --color-primary: #007bff;
    --color-secondary: #6c757d;
    --color-success: #28a745;
    --color-info: #17a2b8;
    --color-warning: #ffc107;
    --color-danger: #dc3545;
    --color-light: #f8f9fa;
    --color-dark: #343a40;
    --color-white: #ffffff;
    --color-black: #000000;
    
    --font-primary: 'Segoe UI', system-ui, -apple-system, sans-serif;
    --font-secondary: 'Georgia', serif;
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
    
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

.page-${name} {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: var(--font-primary);
}

.main-content {
    flex: 1;
    padding: var(--spacing-xl) 0;
}

.${name}-container {
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
}

.${name}-section {
    margin-bottom: var(--spacing-xl);
}

.${name}-section h1 {
    font-size: 2.5rem;
    color: var(--color-dark);
    margin-bottom: var(--spacing-lg);
}

.${name}-content {
    background: var(--color-white);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
}

@media (max-width: 1200px) {
    .${name}-container {
        max-width: 960px;
    }
}

@media (max-width: 992px) {
    .${name}-container {
        max-width: 720px;
    }
}

@media (max-width: 768px) {
    .${name}-container {
        max-width: 540px;
        padding: 0 var(--spacing-md);
    }

    .${name}-section h1 {
        font-size: 2rem;
    }
}

@media (max-width: 576px) {
    .${name}-container {
        padding: 0 var(--spacing-sm);
    }

    .${name}-content {
        padding: var(--spacing-md);
    }
}`,

            js: `class ${name}Page {
    constructor() {
        this.page = document.getElementById('${name}-page');
        this.components = {};
        this.init();
    }

    async init() {
        try {
            await this.loadComponents();
            this.setupEventListeners();
            await this.loadPageContent();
            console.log('${name} page initialized');
        } catch (error) {
            console.error('Error initializing ${name} page:', error);
        }
    }

    async loadComponents() {
        ${componentsList.map(comp => `
        try {
            const ${comp}Element = document.getElementById('${comp}-component');
            if (${comp}Element) {
                this.components.${comp} = new ${comp}Component(${comp}Element);
                await this.components.${comp}.init();
            }
        } catch (error) {
            console.error('Error loading ${comp} component:', error);
        }`).join('\n        ')}
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    async loadPageContent() {
        const contentElement = document.querySelector('.${name}-content');
        if (contentElement) {
            // Adicione o conteúdo específico da página aqui
        }
    }

    handleScroll() {
        // Implementar lógica de scroll se necessário
    }

    handleResize() {
        // Implementar lógica de redimensionamento se necessário
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ${name}Page();
});`
        };
    }
}

module.exports = {
    TemplatePrompts,
    generateHTMLPrompt: TemplatePrompts.generateHTMLPrompt,
    generateCSSPrompt: TemplatePrompts.generateCSSPrompt,
    generateJSPrompt: TemplatePrompts.generateJSPrompt,
    generatePagePrompts: TemplatePrompts.generatePagePrompts
};