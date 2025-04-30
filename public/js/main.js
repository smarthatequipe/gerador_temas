/**
 * Arquivo JavaScript principal
 * Responsável pela interatividade da página inicial
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização de componentes
    initNavigation();
    initHeroSection();
});

// Inicialização da navegação
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Adicionar lógica de navegação aqui
        });
    });
}

// Inicialização da seção hero
function initHeroSection() {
    const createTemplateBtn = document.querySelector('.hero .btn');
    if (createTemplateBtn) {
        createTemplateBtn.addEventListener('click', () => {
            // Redirecionar para a página de criação de template
            window.location.href = '/templates/new';
        });
    }
}

// Função para mostrar mensagens de feedback
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 