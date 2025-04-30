/**
 * Arquivo principal da aplicação
 * Configura e inicia o servidor Express
 * Define as rotas e middlewares
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Middleware de depuração
const debug = (req, res, next) => {
    const start = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    console.log('\n=== REQUEST DEBUG ===');
    console.log(`[${requestId}] ${new Date().toISOString()}`);
    console.log(`[${requestId}] Método: ${req.method}`);
    console.log(`[${requestId}] URL: ${req.url}`);
    console.log(`[${requestId}] Headers:`, req.headers);
    console.log(`[${requestId}] Query:`, req.query);
    console.log(`[${requestId}] Body:`, req.body);
    console.log(`[${requestId}] Cookies:`, req.cookies);
    console.log(`[${requestId}] Session:`, req.session);
    console.log(`[${requestId}] IP: ${req.ip}`);
    console.log(`[${requestId}] User Agent: ${req.get('user-agent')}`);
    
    // Log de resposta
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log('\n=== RESPONSE DEBUG ===');
        console.log(`[${requestId}] ${new Date().toISOString()}`);
        console.log(`[${requestId}] Status: ${res.statusCode}`);
        console.log(`[${requestId}] Headers:`, res.getHeaders());
        console.log(`[${requestId}] Duração: ${duration}ms`);
        console.log('=====================\n');
    });
    
    next();
};

// Middleware de logging
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    
    next();
});

// Middleware de depuração
app.use(debug);

// Rotas
console.log('\n=== CONFIGURAÇÃO DE ROTAS ===');
console.log('Configurando rotas...');

// Rotas de template devem vir antes das rotas principais
app.use('/templates', require('./routes/templateRoutes'));
console.log('Rotas de templates configuradas');

app.use('/', require('./routes/mainRoutes'));
console.log('Rota principal configurada');

app.use('/preview', require('./routes/previewRoutes'));
console.log('Rotas de preview configuradas');

console.log('Rotas configuradas com sucesso!');
console.log('=============================\n');

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('\n=== ERRO ===');
    console.error(`[${new Date().toISOString()}] Erro:`, err.stack);
    console.error('============\n');
    res.status(500).render('error', {
        message: 'Algo deu errado!'
    });
});

// Rota 404
app.use((req, res) => {
    console.log(`[${new Date().toISOString()}] Rota não encontrada: ${req.method} ${req.url}`);
    res.status(404).render('error', {
        message: 'Página não encontrada'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n==========================================');
    console.log('=== SERVIDOR INICIADO ===');
    console.log(`Data/Hora: ${new Date().toISOString()}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Porta: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Diretório de Views: ${path.join(__dirname, '../views')}`);
    console.log(`Diretório Público: ${path.join(__dirname, '../public')}`);
    console.log('==========================================\n');
}); 