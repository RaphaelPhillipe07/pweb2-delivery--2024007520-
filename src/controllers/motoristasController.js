export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res, next) => {
    try {
      const { nome, cpf } = req.body;
      const novoMotorista = this.service.criar({ nome, cpf });
      return res.status(201).json(novoMotorista);
    } catch (err) {
      next(err);
    }
  };

  listarEntregas = (req, res, next) => {
    try {
      const { id } = req.params;
      const entregas = this.service.listarEntregas(id);
      return res.status(200).json(entregas);
    } catch (err) {
      next(err);
    }
  };
}
