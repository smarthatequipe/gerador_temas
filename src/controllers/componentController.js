/**
 * Controlador para gerenciamento de componentes
 * Responsável pela lógica de negócios relacionada a componentes
 */

const Component = require('../models/Component');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Criar um novo componente
exports.createComponent = async (req, res) => {
  try {
    const { templateId, type, specifications } = req.body;
    
    // Validação básica
    if (!templateId || !type || !specifications) {
      return res.status(400).json({ error: 'Template ID, tipo e especificações são obrigatórios' });
    }

    // Gerar componente usando OpenAI
    const prompt = `Crie um componente ${type} com as seguintes especificações: ${JSON.stringify(specifications)}`;
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });

    const generatedCode = completion.choices[0].message.content;

    // Criar componente no banco de dados
    const component = await Component.create({
      templateId,
      type,
      specifications,
      code: generatedCode,
      status: 'pending_approval'
    });

    res.status(201).json(component);
  } catch (error) {
    console.error('Erro ao criar componente:', error);
    res.status(500).json({ error: 'Erro ao criar componente' });
  }
};

// Listar componentes de um template
exports.listComponents = async (req, res) => {
  try {
    const components = await Component.find({ templateId: req.params.templateId });
    res.json(components);
  } catch (error) {
    console.error('Erro ao listar componentes:', error);
    res.status(500).json({ error: 'Erro ao listar componentes' });
  }
};

// Obter um componente específico
exports.getComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ error: 'Componente não encontrado' });
    }
    res.json(component);
  } catch (error) {
    console.error('Erro ao obter componente:', error);
    res.status(500).json({ error: 'Erro ao obter componente' });
  }
};

// Atualizar um componente
exports.updateComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!component) {
      return res.status(404).json({ error: 'Componente não encontrado' });
    }
    res.json(component);
  } catch (error) {
    console.error('Erro ao atualizar componente:', error);
    res.status(500).json({ error: 'Erro ao atualizar componente' });
  }
};

// Aprovar um componente
exports.approveComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!component) {
      return res.status(404).json({ error: 'Componente não encontrado' });
    }
    res.json(component);
  } catch (error) {
    console.error('Erro ao aprovar componente:', error);
    res.status(500).json({ error: 'Erro ao aprovar componente' });
  }
};

// Solicitar modificação de um componente
exports.requestModification = async (req, res) => {
  try {
    const { modifications } = req.body;
    
    if (!modifications) {
      return res.status(400).json({ error: 'Modificações são obrigatórias' });
    }

    const component = await Component.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'pending_modification',
        modifications
      },
      { new: true }
    );

    if (!component) {
      return res.status(404).json({ error: 'Componente não encontrado' });
    }

    res.json(component);
  } catch (error) {
    console.error('Erro ao solicitar modificação:', error);
    res.status(500).json({ error: 'Erro ao solicitar modificação' });
  }
}; 