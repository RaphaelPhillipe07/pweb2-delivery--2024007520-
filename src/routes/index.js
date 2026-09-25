import { Router } from 'express';
import { Database } from '../database/database.js';
import { EntregasRepository } from '../repositories/entregasRepository.js';
import { MotoristasRepository } from '../repositories/motoristasRepository.js';
import { EntregasService } from '../services/entregasService.js';
import { MotoristasService } from '../services/motoristasService.js';
import { EntregasController } from '../controllers/entregasController.js';
import { MotoristasController } from '../controllers/motoristasController.js';
import { criarEntregasRouter } from './entregasRoutes.js';
import { criarMotoristasRouter } from './motoristasRoutes.js';

export function criarRotas(dbInstance) {
  const db = dbInstance || new Database();

  const entregasRepository = new EntregasRepository(db);
  const motoristasRepository = new MotoristasRepository(db);

  const entregasService = new EntregasService(entregasRepository, motoristasRepository);
  const motoristasService = new MotoristasService(motoristasRepository, entregasRepository);

  const entregasController = new EntregasController(entregasService);
  const motoristasController = new MotoristasController(motoristasService);

  const router = Router();
  router.use('/entregas', criarEntregasRouter(entregasController));
  router.use('/motoristas', criarMotoristasRouter(motoristasController));

  return router;
}
