/**
 * Arquivo JavaScript para o formulário de criação de template
 * Responsável por gerenciar a interatividade do formulário e envio dos dados
 */

document.addEventListener('DOMContentLoaded', () => {
    initTemplateForm();
});

// Inicialização do formulário
function initTemplateForm() {
    const form = document.getElementById('templateForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Manipulador de envio do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Coletar dados do formulário
    const data = {
        domain: formData.get('domain'),
        niche: formData.get('niche'),
        specifications: formData.get('specifications'),
        pages: Array.from(formData.getAll('pages')),
        components: Array.from(formData.getAll('components'))
    };

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // O redirecionamento será feito pelo servidor
            showMessage('Template criado com sucesso!');
        } else {
            throw new Error('Erro ao criar template');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao criar template', 'error');
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