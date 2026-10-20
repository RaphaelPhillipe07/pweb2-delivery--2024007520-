export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  listar = async (req, res, next) => {
    try {
      const motoristas = await this.service.listar();
      return res.status(200).json(motoristas);
    } catch (err) {
      next(err);
    }
  };

  criar = async (req, res, next) => {
    try {
      const { nome, cpf } = req.body;
      const novoMotorista = await this.service.criar({ nome, cpf });
      return res.status(201).json(novoMotorista);
    } catch (err) {
      next(err);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const motorista = await this.service.buscarPorId(id);
      return res.status(200).json(motorista);
    } catch (err) {
      next(err);
    }
  };

  listarEntregas = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      const entregas = await this.service.listarEntregas(id, status);
      return res.status(200).json(entregas);
    } catch (err) {
      next(err);
    }
  };
}
