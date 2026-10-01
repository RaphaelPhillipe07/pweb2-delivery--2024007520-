export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  listar = (req, res, next) => {
    try {
      const motoristas = this.service.listar();
      return res.status(200).json(motoristas);
    } catch (err) {
      next(err);
    }
  };

  criar = (req, res, next) => {
    try {
      const { nome, cpf } = req.body;
      const novoMotorista = this.service.criar({ nome, cpf });
      return res.status(201).json(novoMotorista);
    } catch (err) {
      next(err);
    }
  };

  buscarPorId = (req, res, next) => {
    try {
      const { id } = req.params;
      const motorista = this.service.buscarPorId(id);
      return res.status(200).json(motorista);
    } catch (err) {
      next(err);
    }
  };

  listarEntregas = (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      const entregas = this.service.listarEntregas(id, status);
      return res.status(200).json(entregas);
    } catch (err) {
      next(err);
    }
  };
}
