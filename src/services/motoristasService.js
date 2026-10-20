import { ServiceError } from './entregasService.js';

export class MotoristasService {
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepository = motoristasRepository;
    this.entregasRepository = entregasRepository;
  }

  async listar() {
    return this.motoristasRepository.listarTodos();
  }

  async criar({ nome, cpf }) {
    if (!nome || !cpf) {
      throw new ServiceError(400, 'Nome e CPF são obrigatórios');
    }

    const existente = await this.motoristasRepository.buscarPorCpf(cpf);
    if (existente) {
      throw new ServiceError(409, 'CPF já cadastrado');
    }

    return this.motoristasRepository.criar({ nome, cpf, status: 'ATIVO' });
  }

  async buscarPorId(id) {
    const motorista = await this.motoristasRepository.buscarPorId(id);
    if (!motorista) {
      throw new ServiceError(404, 'Motorista não encontrado');
    }
    return motorista;
  }

  async listarEntregas(motoristaId, filtroStatus) {
    await this.buscarPorId(motoristaId);
    const entregas = await this.entregasRepository.listarTodos(
      filtroStatus ? { status: filtroStatus } : {}
    );
    return entregas.filter((e) => e.motoristaId === Number(motoristaId));
  }
}
