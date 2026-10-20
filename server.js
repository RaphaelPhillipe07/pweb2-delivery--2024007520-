import express from 'express';
import { criarRotas } from './src/routes/index.js';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', criarRotas());

app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  return res.status(status).json({ erro: err.message || 'Erro interno do servidor' });
});

app.use((req, res) => res.status(404).json({ erro: 'recurso não encontrado' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Delivery Tracker rodando em http://localhost:${PORT}`));
