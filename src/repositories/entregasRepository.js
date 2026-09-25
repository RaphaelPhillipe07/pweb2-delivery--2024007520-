export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  findAll() {
    return this.database.entregas;
  }

  findById(id) {
    const numId = Number(id);
    return this.database.entregas.find((e) => e.id === numId) || null;
  }

  findAtivaDuplicada(descricao, origem, destino) {
    return this.database.entregas.find(
      (e) =>
        e.descricao === descricao &&
        e.origem === origem &&
        e.destino === destino &&
        e.status !== 'ENTREGUE' &&
        e.status !== 'CANCELADA'
    ) || null;
  }

  create(dados) {
    const novaEntrega = {
      id: this.database.currentId++,
      descricao: dados.descricao,
      origem: dados.origem,
      destino: dados.destino,
      status: dados.status,
      motoristaId: dados.motoristaId ?? null,
      historico: dados.historico ?? []
    };

    this.database.entregas.push(novaEntrega);
    return novaEntrega;
  }

  update(id, dadosAtualizados) {
    const numId = Number(id);
    const index = this.database.entregas.findIndex((e) => e.id === numId);
    if (index === -1) return null;

    this.database.entregas[index] = {
      ...this.database.entregas[index],
      ...dadosAtualizados
    };

    return this.database.entregas[index];
  }
}
