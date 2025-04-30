/**
 * Modelo para Componente
 * Define a estrutura de dados para os componentes usando armazenamento em memória
 */

class Component {
    constructor() {
        this.components = [];
        this.nextId = 1;
    }

    create(data) {
        const component = {
            id: this.nextId++,
            ...data,
            status: 'pending_approval',
            modifications: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.components.push(component);
        return component;
    }

    find(query = {}) {
        if (query.templateId) {
            return this.components.filter(c => c.templateId === parseInt(query.templateId));
        }
        return this.components;
    }

    findById(id) {
        return this.components.find(c => c.id === parseInt(id));
    }

    findByIdAndUpdate(id, data) {
        const index = this.components.findIndex(c => c.id === parseInt(id));
        if (index === -1) return null;
        
        this.components[index] = {
            ...this.components[index],
            ...data,
            updatedAt: new Date()
        };
        
        return this.components[index];
    }

    findByIdAndDelete(id) {
        const index = this.components.findIndex(c => c.id === parseInt(id));
        if (index === -1) return null;
        
        const deleted = this.components[index];
        this.components.splice(index, 1);
        return deleted;
    }
}

module.exports = new Component(); 