import { Router } from 'express';
import { regrasMotorista } from '../middlewares/validators.js';

export function criarMotoristasRouter(motoristasController) {
  const router = Router();

  router.get('/', motoristasController.listar);
  router.get('/novo', motoristasController.novo);
  router.post('/', regrasMotorista, motoristasController.criar);

  return router;
}
