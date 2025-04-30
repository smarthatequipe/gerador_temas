/**
 * Arquivo JavaScript para preview de template
 * Responsável pela interatividade da página de preview de template
 */

document.addEventListener('DOMContentLoaded', () => {
    initComponentActions();
    initModificationForm();
});

// Inicialização das ações dos componentes
function initComponentActions() {
    const approveButtons = document.querySelectorAll('.btn.approve');
    const modifyButtons = document.querySelectorAll('.btn.modify');

    approveButtons.forEach(button => {
        button.addEventListener('click', handleApprove);
    });

    modifyButtons.forEach(button => {
        button.addEventListener('click', handleModify);
    });
}

// Inicialização do formulário de modificação
function initModificationForm() {
    const form = document.getElementById('modificationForm');
    if (form) {
        form.addEventListener('submit', handleModificationSubmit);
    }
}

// Manipulador de aprovação de componente
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
            // Atualizar a interface
            updateComponentStatus(componentId, 'approved');
        } else {
            throw new Error('Erro ao aprovar componente');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao aprovar componente', 'error');
    }
}

// Manipulador de modificação de componente
function handleModify(e) {
    const componentId = e.target.dataset.componentId;
    const form = document.querySelector('.modification-form');
    const componentIdInput = document.getElementById('componentId');
    
    // Mostrar formulário e definir o ID do componente
    form.style.display = 'block';
    componentIdInput.value = componentId;
    
    // Rolar até o formulário
    form.scrollIntoView({ behavior: 'smooth' });
}

// Manipulador de envio de modificação
async function handleModificationSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const componentId = form.querySelector('#componentId').value;
    const modifications = form.querySelector('#modifications').value;
    
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
            // Atualizar a interface
            updateComponentStatus(componentId, 'pending_modification');
            // Esconder o formulário
            form.parentElement.style.display = 'none';
            // Limpar o formulário
            form.reset();
        } else {
            throw new Error('Erro ao solicitar modificação');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao solicitar modificação', 'error');
    }
}

// Atualizar status do componente na interface
function updateComponentStatus(componentId, status) {
    const component = document.querySelector(`[data-component-id="${componentId}"]`);
    const statusElement = component.querySelector('.status');
    
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