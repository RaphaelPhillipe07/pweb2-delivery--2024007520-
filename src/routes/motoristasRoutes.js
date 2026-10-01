import { Router } from 'express';

export function criarMotoristasRouter(motoristasController) {
  const router = Router();

  router.post('/', motoristasController.criar);
  router.get('/', motoristasController.listar);
  router.get('/:id/entregas', motoristasController.listarEntregas);
  router.get('/:id', motoristasController.buscarPorId);

  return router;
}
