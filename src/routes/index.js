import { Router } from 'express';
import { Database } from '../database/database.js';
import { EntregasRepository } from '../repositories/entregasRepository.js';
import { EntregasService } from '../services/entregasService.js';
import { EntregasController } from '../controllers/entregasController.js';
import { criarEntregasRouter } from './entregasRoutes.js';

export function criarRotas(dbInstance) {
  const db = dbInstance || new Database();

  const entregasRepository = new EntregasRepository(db);
  const entregasService = new EntregasService(entregasRepository);
  const entregasController = new EntregasController(entregasService);

  const router = Router();
  router.use('/entregas', criarEntregasRouter(entregasController));

  return router;
}
