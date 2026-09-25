import { ServiceError } from './entregasService.js';

export class MotoristasService {
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepository = motoristasRepository;
    this.entregasRepository = entregasRepository;
  }

  criar({ nome, cpf }) {
    if (!nome || !cpf) {
      throw new ServiceError(400, 'Nome e CPF são obrigatórios');
    }

    const existente = this.motoristasRepository.findByCpf(cpf);
    if (existente) {
      throw new ServiceError(409, 'CPF já cadastrado');
    }

    return this.motoristasRepository.create({ nome, cpf, status: 'ATIVO' });
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepository.findById(id);
    if (!motorista) {
      throw new ServiceError(404, 'Motorista não encontrado');
    }
    return motorista;
  }

  listarEntregas(motoristaId) {
    this.buscarPorId(motoristaId);
    const entregas = this.entregasRepository.findAll();
    return entregas.filter((e) => e.motoristaId === Number(motoristaId));
  }
}
