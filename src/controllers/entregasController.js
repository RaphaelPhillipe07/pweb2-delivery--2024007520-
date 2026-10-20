export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  listar = async (req, res, next) => {
    try {
      const { status } = req.query;
      const entregas = await this.service.listar(status);
      return res.status(200).json(entregas);
    } catch (err) {
      next(err);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const entrega = await this.service.buscarPorId(id);
      return res.status(200).json(entrega);
    } catch (err) {
      next(err);
    }
  };

  criar = async (req, res, next) => {
    try {
      const { descricao, origem, destino } = req.body;
      const novaEntrega = await this.service.criar({ descricao, origem, destino });
      return res.status(201).json(novaEntrega);
    } catch (err) {
      next(err);
    }
  };

  avancar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const atualizada = await this.service.avancar(id);
      return res.status(200).json(atualizada);
    } catch (err) {
      next(err);
    }
  };

  cancelar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const cancelada = await this.service.cancelar(id);
      return res.status(200).json(cancelada);
    } catch (err) {
      next(err);
    }
  };

  obterHistorico = async (req, res, next) => {
    try {
      const { id } = req.params;
      const historico = await this.service.obterHistorico(id);
      return res.status(200).json(historico);
    } catch (err) {
      next(err);
    }
  };

  atribuir = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { motoristaId } = req.body;
      const atualizada = await this.service.atribuir(id, motoristaId);
      return res.status(200).json(atualizada);
    } catch (err) {
      next(err);
    }
  };
}
