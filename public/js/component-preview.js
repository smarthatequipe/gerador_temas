/**
 * Arquivo JavaScript para preview de componente
 * Responsável pela interatividade da página de preview de componente
 */

document.addEventListener('DOMContentLoaded', () => {
    initComponentActions();
    initModificationForm();
});

// Inicialização das ações do componente
function initComponentActions() {
    const approveButton = document.querySelector('.btn.approve');
    const modifyButton = document.querySelector('.btn.modify');

    if (approveButton) {
        approveButton.addEventListener('click', handleApprove);
    }

    if (modifyButton) {
        modifyButton.addEventListener('click', handleModify);
    }
}

// Inicialização do formulário de modificação
function initModificationForm() {
    const form = document.getElementById('modificationForm');
    if (form) {
        form.addEventListener('submit', handleModificationSubmit);
    }
}

// Manipulador de aprovação
async function handleApprove(e) {
    const componentId = e.target.dataset.componentId;
    
    try {
        const response = await fetch(`/api/components/${componentId}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showMessage('Componente aprovado com sucesso!');
            // Atualizar status na interface
            updateComponentStatus('approved');
        } else {
            throw new Error('Erro ao aprovar componente');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao aprovar componente', 'error');
    }
}

// Manipulador de modificação
function handleModify() {
    const form = document.querySelector('.modification-form');
    form.style.display = 'block';
}

// Manipulador de envio de modificação
async function handleModificationSubmit(e) {
    e.preventDefault();
    
    const componentId = document.querySelector('.btn.modify').dataset.componentId;
    const form = e.target;
    const modifications = form.querySelector('textarea').value;
    
    try {
        const response = await fetch(`/api/components/${componentId}/modify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modifications })
        });

        if (response.ok) {
            showMessage('Modificação solicitada com sucesso!');
            // Atualizar status na interface
            updateComponentStatus('pending_modification');
            form.style.display = 'none';
        } else {
            throw new Error('Erro ao solicitar modificação');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao solicitar modificação', 'error');
    }
}

// Atualizar status do componente na interface
function updateComponentStatus(status) {
    const statusElement = document.querySelector('.component-info p');
    if (statusElement) {
        statusElement.textContent = `Status: ${status}`;
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