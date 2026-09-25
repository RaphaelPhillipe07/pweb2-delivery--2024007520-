export class ServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class EntregasService {
  constructor(repository) {
    this.repository = repository;
  }

  listar(filtroStatus) {
    const entregas = this.repository.findAll();
    if (filtroStatus) {
      return entregas.filter((e) => e.status === filtroStatus);
    }
    return entregas;
  }

  buscarPorId(id) {
    const entrega = this.repository.findById(id);
    if (!entrega) {
      throw new ServiceError(404, 'Entrega não encontrada');
    }
    return entrega;
  }

  criar({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      throw new ServiceError(400, 'Campos obrigatórios ausentes: descricao, origem e destino');
    }

    if (origem.trim() === destino.trim()) {
      throw new ServiceError(400, 'Origem e destino não podem ser iguais');
    }

    const duplicada = this.repository.findAtivaDuplicada(descricao, origem, destino);
    if (duplicada) {
      throw new ServiceError(409, 'Já existe uma entrega ativa idêntica em andamento');
    }

    const novaEntrega = this.repository.create({
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

  avancar(id) {
    const entrega = this.buscarPorId(id);

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

    return this.repository.update(id, {
      status: proximoStatus,
      historico: novoHistorico
    });
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw new ServiceError(422, `Não é possível cancelar uma entrega com status ${entrega.status}`);
    }

    const novoHistorico = [
      ...entrega.historico,
      { data: new Date().toISOString(), descricao: 'Entrega cancelada' }
    ];

    return this.repository.update(id, {
      status: 'CANCELADA',
      historico: novoHistorico
    });
  }

  obterHistorico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }
}
