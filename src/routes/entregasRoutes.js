import { Router } from 'express';

export function criarEntregasRouter(entregasController) {
  const router = Router();

  router.post('/', entregasController.criar);
  router.get('/', entregasController.listar);
  router.get('/:id', entregasController.buscarPorId);
  router.patch('/:id/avancar', entregasController.avancar);
  router.patch('/:id/cancelar', entregasController.cancelar);
  router.get('/:id/historico', entregasController.obterHistorico);
  router.patch('/:id/atribuir', entregasController.atribuir);

  return router;
}
