import { Router } from 'express';
import { EntregasRepositoryPrisma } from '../repositories/entregasRepository.prisma.js';
import { MotoristasRepositoryPrisma } from '../repositories/motoristasRepository.prisma.js';
import { EntregasService } from '../services/entregasService.js';
import { MotoristasService } from '../services/motoristasService.js';
import { EntregasController } from '../controllers/entregasController.js';
import { MotoristasController } from '../controllers/motoristasController.js';
import { criarEntregasRouter } from './entregasRoutes.js';
import { criarMotoristasRouter } from './motoristasRoutes.js';

export function criarRotas() {
  const entregasRepository = new EntregasRepositoryPrisma();
  const motoristasRepository = new MotoristasRepositoryPrisma();

  const entregasService = new EntregasService(entregasRepository, motoristasRepository);
  const motoristasService = new MotoristasService(motoristasRepository, entregasRepository);

  const entregasController = new EntregasController(entregasService, motoristasService);
  const motoristasController = new MotoristasController(motoristasService);

  const router = Router();
  router.get('/', (req, res) => res.redirect('/entregas'));
  router.use('/entregas', criarEntregasRouter(entregasController));
  router.use('/motoristas', criarMotoristasRouter(motoristasController));

  return router;
}
