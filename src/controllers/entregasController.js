export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  listar = (req, res, next) => {
    try {
      const { status } = req.query;
      const entregas = this.service.listar(status);
      return res.status(200).json(entregas);
    } catch (err) {
      next(err);
    }
  };

  buscarPorId = (req, res, next) => {
    try {
      const { id } = req.params;
      const entrega = this.service.buscarPorId(id);
      return res.status(200).json(entrega);
    } catch (err) {
      next(err);
    }
  };

  criar = (req, res, next) => {
    try {
      const { descricao, origem, destino } = req.body;
      const novaEntrega = this.service.criar({ descricao, origem, destino });
      return res.status(201).json(novaEntrega);
    } catch (err) {
      next(err);
    }
  };

  avancar = (req, res, next) => {
    try {
      const { id } = req.params;
      const atualizada = this.service.avancar(id);
      return res.status(200).json(atualizada);
    } catch (err) {
      next(err);
    }
  };

  cancelar = (req, res, next) => {
    try {
      const { id } = req.params;
      const cancelada = this.service.cancelar(id);
      return res.status(200).json(cancelada);
    } catch (err) {
      next(err);
    }
  };

  obterHistorico = (req, res, next) => {
    try {
      const { id } = req.params;
      const historico = this.service.obterHistorico(id);
      return res.status(200).json(historico);
    } catch (err) {
      next(err);
    }
  };
}
