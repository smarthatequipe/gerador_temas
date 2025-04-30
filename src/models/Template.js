/**
 * Modelo de Template
 * Responsável por gerenciar os templates usando sistema de arquivos
 * Armazena os templates em diretórios estruturados
 * Fornece métodos para CRUD de templates
 */

const fs = require('fs').promises;
const path = require('path');

class Template {
    constructor() {
        this.templatesDir = path.join(__dirname, '../../templates');
    }

    /**
     * Cria um novo template
     * @param {Object} data - Dados do template
     * @returns {Promise<Object>} - Template criado
     */
    async create(data) {
        try {
            const templateDir = path.join(this.templatesDir, data.domain);
            await fs.mkdir(templateDir, { recursive: true });

            // Criar estrutura de diretórios
            await Promise.all([
                fs.mkdir(path.join(templateDir, 'components'), { recursive: true }),
                fs.mkdir(path.join(templateDir, 'pages'), { recursive: true })
            ]);

            // Salvar metadados do template
            const metadata = {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await fs.writeFile(
                path.join(templateDir, 'metadata.json'),
                JSON.stringify(metadata, null, 2)
            );

            return metadata;
        } catch (error) {
            console.error('Erro ao criar template:', error);
            throw new Error('Falha ao criar template');
        }
    }

    /**
     * Lista todos os templates
     * @returns {Promise<Array>} - Lista de templates
     */
    async findAll() {
        try {
            const templates = [];
            const dirs = await fs.readdir(this.templatesDir);

            for (const dir of dirs) {
                const metadataPath = path.join(this.templatesDir, dir, 'metadata.json');
                try {
                    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
                    templates.push(metadata);
                } catch (error) {
                    console.error(`Erro ao ler metadata do template ${dir}:`, error);
                }
            }

            return templates;
        } catch (error) {
            console.error('Erro ao listar templates:', error);
            throw new Error('Falha ao listar templates');
        }
    }

    /**
     * Busca um template pelo domínio
     * @param {string} domain - Domínio do template
     * @returns {Promise<Object>} - Template encontrado
     */
    async findByDomain(domain) {
        try {
            const metadataPath = path.join(this.templatesDir, domain, 'metadata.json');
            const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
            return metadata;
        } catch (error) {
            console.error('Erro ao buscar template:', error);
            throw new Error('Template não encontrado');
        }
    }

    /**
     * Atualiza um template
     * @param {string} domain - Domínio do template
     * @param {Object} data - Novos dados do template
     * @returns {Promise<Object>} - Template atualizado
     */
    async update(domain, data) {
        try {
            const templateDir = path.join(this.templatesDir, domain);
            const metadataPath = path.join(templateDir, 'metadata.json');

            const currentMetadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
            const updatedMetadata = {
                ...currentMetadata,
                ...data,
                updatedAt: new Date().toISOString()
            };

            await fs.writeFile(
                metadataPath,
                JSON.stringify(updatedMetadata, null, 2)
            );

            return updatedMetadata;
        } catch (error) {
            console.error('Erro ao atualizar template:', error);
            throw new Error('Falha ao atualizar template');
        }
    }

    /**
     * Remove um template
     * @param {string} domain - Domínio do template
     * @returns {Promise<void>}
     */
    async delete(domain) {
        try {
            const templateDir = path.join(this.templatesDir, domain);
            await fs.rm(templateDir, { recursive: true, force: true });
        } catch (error) {
            console.error('Erro ao remover template:', error);
            throw new Error('Falha ao remover template');
        }
    }
}

module.exports = new Template(); 