import { ServiceError } from './entregasService.js';

export class MotoristasService {
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepository = motoristasRepository;
    this.entregasRepository = entregasRepository;
  }

  listar() {
    return this.motoristasRepository.listarTodos();
  }

  criar({ nome, cpf }) {
    if (!nome || !cpf) {
      throw new ServiceError(400, 'Nome e CPF são obrigatórios');
    }

    const existente = this.motoristasRepository.buscarPorCpf(cpf);
    if (existente) {
      throw new ServiceError(409, 'CPF já cadastrado');
    }

    return this.motoristasRepository.criar({ nome, cpf, status: 'ATIVO' });
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepository.buscarPorId(id);
    if (!motorista) {
      throw new ServiceError(404, 'Motorista não encontrado');
    }
    return motorista;
  }

  listarEntregas(motoristaId, filtroStatus) {
    this.buscarPorId(motoristaId);
    const entregas = this.entregasRepository.listarTodos(
      filtroStatus ? { status: filtroStatus } : {}
    );
    return entregas.filter((e) => e.motoristaId === Number(motoristaId));
  }
}
