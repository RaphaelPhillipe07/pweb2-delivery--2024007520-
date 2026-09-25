import { Router } from 'express';

export function criarMotoristasRouter(motoristasController) {
  const router = Router();

  router.post('/', motoristasController.criar);
  router.get('/:id/entregas', motoristasController.listarEntregas);

  return router;
}
