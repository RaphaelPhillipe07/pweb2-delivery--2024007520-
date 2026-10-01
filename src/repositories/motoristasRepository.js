/**
 * Contrato IMotoristasRepository.
 *
 * @typedef {Object} IMotoristasRepository
 * @property {() => Object[]} listarTodos
 * @property {(id: number | string) => Object | null} buscarPorId
 * @property {(cpf: string) => Object | null} buscarPorCpf
 * @property {(dados: Object) => Object} criar
 */

/**
 * Implementação em memória do IMotoristasRepository.
 */
export class MotoristasRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Lista todos os motoristas.
   *
   * @returns {Object[]}
   */
  listarTodos() {
    return this.database.motoristas;
  }

  /**
   * Busca um motorista pelo id.
   *
   * @param {number | string} id
   * @returns {Object | null}
   */
  buscarPorId(id) {
    const numId = Number(id);
    return this.database.motoristas.find((m) => m.id === numId) || null;
  }

  /**
   * Busca um motorista pelo CPF.
   *
   * @param {string} cpf
   * @returns {Object | null}
   */
  buscarPorCpf(cpf) {
    return this.database.motoristas.find((m) => m.cpf === cpf) || null;
  }

  /**
   * Cria um novo motorista.
   *
   * @param {Object} dados
   * @returns {Object}
   */
  criar(dados) {
    const novoMotorista = {
      id: this.database.currentMotoristaId++,
      nome: dados.nome,
      cpf: dados.cpf,
      status: dados.status || 'ATIVO'
    };

    this.database.motoristas.push(novoMotorista);
    return novoMotorista;
  }
}
