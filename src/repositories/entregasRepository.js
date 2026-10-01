/**
 * Contrato IEntregasRepository.
 *
 * @typedef {Object} IEntregasRepository
 * @property {(filtros?: { status?: string }) => Object[]} listarTodos
 * @property {(id: number | string) => Object | null} buscarPorId
 * @property {(dados: Object) => Object} criar
 * @property {(id: number | string, dados: Object) => Object} atualizar
 */

/**
 * Implementação em memória do IEntregasRepository.
 */
export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Lista todas as entregas, com filtro opcional por status.
   *
   * @param {{ status?: string }} [filtros]
   * @returns {Object[]}
   */
  listarTodos(filtros = {}) {
    if (filtros && filtros.status) {
      return this.database.entregas.filter((e) => e.status === filtros.status);
    }
    return this.database.entregas;
  }

  /**
   * Busca uma entrega pelo id.
   *
   * @param {number | string} id
   * @returns {Object | null}
   */
  buscarPorId(id) {
    const numId = Number(id);
    return this.database.entregas.find((e) => e.id === numId) || null;
  }

  /**
   * Cria uma nova entrega.
   *
   * @param {Object} dados
   * @returns {Object}
   */
  criar(dados) {
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

  /**
   * Atualiza uma entrega existente.
   *
   * @param {number | string} id
   * @param {Object} dadosAtualizados
   * @returns {Object}
   */
  atualizar(id, dadosAtualizados) {
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
