import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configurações de Segurança
const RESULTS_FILE = path.join(__dirname, 'database', 'results.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'moreenglish2025';
const POST_TOKEN = process.env.POST_TOKEN || 'marq-test-save-v1';

app.use(cors());
app.use(express.json());

// Garantir que o diretório database exista
async function ensureDatabaseDir() {
  const dbDir = path.dirname(RESULTS_FILE);
  try {
    await fs.access(dbDir);
  } catch {
    await fs.mkdir(dbDir, { recursive: true });
    console.log('Diretório database criado.');
  }
}

// Garantir que o arquivo de resultados exista
async function ensureResultsFile() {
  await ensureDatabaseDir();
  try {
    await fs.access(RESULTS_FILE);
  } catch (error) {
    await fs.writeFile(RESULTS_FILE, JSON.stringify([], null, 2));
    console.log('Arquivo results.json criado.');
  }
}

// Endpoint para salvar resultados (Protegido por Token)
app.post('/api/results', async (req, res) => {
  const { token } = req.query;
  
  if (token !== POST_TOKEN) {
    return res.status(403).json({ error: 'Não autorizado' });
  }

  try {
    const newResult = req.body;
    await ensureResultsFile();
    const data = await fs.readFile(RESULTS_FILE, 'utf8');
    const results = JSON.parse(data);
    
    // Adicionar timestamp
    newResult.createdAt = new Date().toISOString();
    results.push(newResult);
    
    await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log(`Resultado salvo para: ${newResult.userInfo.name}`);
    res.status(201).json({ message: 'Resultado salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
    res.status(500).json({ error: 'Erro ao salvar resultado' });
  }
});

// Endpoint para buscar todos os resultados (Protegido por Senha)
app.get('/api/results', async (req, res) => {
  const { password } = req.query;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  try {
    await ensureResultsFile();
    const data = await fs.readFile(RESULTS_FILE, 'utf8');
    const results = JSON.parse(data);
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro ao buscar resultados' });
  }
});

// Endpoint para excluir um resultado (Protegido por Senha)
app.delete('/api/results/:createdAt', async (req, res) => {
  const { password, createdAt: createdAtQuery } = req.query;
  const createdAtParams = req.params.createdAt;
  const createdAt = createdAtParams || createdAtQuery;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  try {
    await ensureResultsFile();
    const data = await fs.readFile(RESULTS_FILE, 'utf8');
    let results = JSON.parse(data);
    
    const initialLength = results.length;
    results = results.filter(r => r.createdAt !== createdAt);
    
    if (results.length === initialLength) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }
    
    await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log(`Resultado excluído: ${createdAt}`);
    res.json({ message: 'Resultado excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir resultado:', error);
    res.status(500).json({ error: 'Erro ao excluir resultado' });
  }
});

// Servir arquivos estáticos do Vite (após o build)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Redirecionar todas as outras rotas para o index.html (SPA)
app.get('*', (req, res, next) => {
  // Se for uma rota de API, ignora
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  ensureResultsFile();
});
