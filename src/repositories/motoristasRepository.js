export class MotoristasRepository {
  constructor(database) {
    this.database = database;
  }

  findAll() {
    return this.database.motoristas;
  }

  findById(id) {
    const numId = Number(id);
    return this.database.motoristas.find((m) => m.id === numId) || null;
  }

  findByCpf(cpf) {
    return this.database.motoristas.find((m) => m.cpf === cpf) || null;
  }

  create(dados) {
    const novoMotorista = {
      id: this.database.currentMotoristaId++,
      nome: dados.nome,
      cpf: dados.cpf,
      status: dados.status || 'ATIVO'
    };

    this.database.motoristas.push(novoMotorista);
    return novoMotorista;
  }

  update(id, dadosAtualizados) {
    const numId = Number(id);
    const index = this.database.motoristas.findIndex((m) => m.id === numId);
    if (index === -1) return null;

    this.database.motoristas[index] = {
      ...this.database.motoristas[index],
      ...dadosAtualizados
    };

    return this.database.motoristas[index];
  }
}
