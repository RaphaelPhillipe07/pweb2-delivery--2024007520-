import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Delivery Tracker API rodando na porta ${PORT}`);
});
