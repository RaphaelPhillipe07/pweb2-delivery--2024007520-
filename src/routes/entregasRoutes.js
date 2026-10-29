import { Router } from 'express';
import { regrasEntrega } from '../middlewares/validators.js';

export function criarEntregasRouter(entregasController) {
  const router = Router();

  router.get('/', entregasController.listar);
  router.get('/nova', entregasController.nova);
  router.post('/', regrasEntrega, entregasController.criar);
  router.get('/:id', entregasController.detalhe);
  router.patch('/:id/avancar', entregasController.avancar);
  router.patch('/:id/cancelar', entregasController.cancelar);
  router.patch('/:id/atribuir', entregasController.atribuir);

  return router;
}
