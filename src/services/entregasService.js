export class ServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class EntregasService {
  constructor(repository, motoristasRepository) {
    this.repository = repository;
    this.motoristasRepository = motoristasRepository;
  }

  async listar(filtroStatus) {
    if (filtroStatus) {
      return this.repository.listarTodos({ status: filtroStatus });
    }
    return this.repository.listarTodos();
  }

  async buscarPorId(id) {
    const entrega = await this.repository.buscarPorId(id);
    if (!entrega) {
      throw new ServiceError(404, 'Entrega não encontrada');
    }
    return entrega;
  }

  async criar({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      throw new ServiceError(400, 'Campos obrigatórios ausentes: descricao, origem e destino');
    }

    if (origem.trim() === destino.trim()) {
      throw new ServiceError(400, 'Origem e destino não podem ser iguais');
    }

    const todas = await this.repository.listarTodos();
    const duplicada = todas.find((e) =>
      e.descricao === descricao &&
      e.origem === origem &&
      e.destino === destino &&
      e.status !== 'ENTREGUE' &&
      e.status !== 'CANCELADA'
    );

    if (duplicada) {
      throw new ServiceError(409, 'Já existe uma entrega ativa idêntica em andamento');
    }

    const novaEntrega = await this.repository.criar({
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [
        {
          data: new Date().toISOString(),
          descricao: 'Entrega criada'
        }
      ]
    });

    return novaEntrega;
  }

  async avancar(id) {
    const entrega = await this.buscarPorId(id);

    let proximoStatus = null;
    let descricaoEvento = '';

    if (entrega.status === 'CRIADA') {
      proximoStatus = 'EM_TRANSITO';
      descricaoEvento = 'Status alterado para EM_TRANSITO';
    } else if (entrega.status === 'EM_TRANSITO') {
      proximoStatus = 'ENTREGUE';
      descricaoEvento = 'Status alterado para ENTREGUE';
    } else {
      throw new ServiceError(422, `Transição inválida a partir do status atual: ${entrega.status}`);
    }

    const novoHistorico = [
      ...entrega.historico,
      { data: new Date().toISOString(), descricao: descricaoEvento }
    ];

    return this.repository.atualizar(id, {
      status: proximoStatus,
      historico: novoHistorico
    });
  }

  async cancelar(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw new ServiceError(422, `Não é possível cancelar uma entrega com status ${entrega.status}`);
    }

    const novoHistorico = [
      ...entrega.historico,
      { data: new Date().toISOString(), descricao: 'Entrega cancelada' }
    ];

    return this.repository.atualizar(id, {
      status: 'CANCELADA',
      historico: novoHistorico
    });
  }

  async obterHistorico(id) {
    const entrega = await this.buscarPorId(id);
    return entrega.historico;
  }

  async atribuir(id, motoristaId) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status !== 'CRIADA') {
      throw new ServiceError(422, `Não é possível atribuir motorista para entrega com status ${entrega.status}`);
    }

    if (!motoristaId) {
      throw new ServiceError(400, 'motoristaId é obrigatório');
    }

    const numMotoristaId = Number(motoristaId);
    const motorista = this.motoristasRepository ? await this.motoristasRepository.buscarPorId(numMotoristaId) : null;
    if (!motorista) {
      throw new ServiceError(404, 'Motorista não encontrado');
    }

    if (motorista.status !== 'ATIVO') {
      throw new ServiceError(422, 'Motorista inativo');
    }

    const novoHistorico = [
      ...entrega.historico,
      { data: new Date().toISOString(), descricao: `Motorista ${motorista.nome} atribuído` }
    ];

    return this.repository.atualizar(id, {
      motoristaId: numMotoristaId,
      historico: novoHistorico
    });
  }
}
