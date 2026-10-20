import { prisma } from '../config/database.js';

/**
 * Contrato IEntregasRepository (mesmo do Cap. 4), agora com persistência real:
 *
 *   listarTodos(filtros?) -> Promise<Entrega[]>
 *   buscarPorId(id)       -> Promise<Entrega | null>
 *   criar(dados)          -> Promise<Entrega>
 *   atualizar(id, dados)  -> Promise<Entrega | null>
 */

function formatarEntrega(entrega) {
  return {
    id: entrega.id,
    descricao: entrega.descricao,
    origem: entrega.origem,
    destino: entrega.destino,
    status: entrega.status,
    motoristaId: entrega.motoristaId,
    historico: entrega.historico.map((evento) => ({
      data: evento.data,
      descricao: evento.descricao
    }))
  };
}

const includeHistorico = {
  historico: { orderBy: { id: 'asc' } }
};

export class EntregasRepositoryPrisma {
  /**
   * Lista todas as entregas, com filtro opcional por status.
   */
  async listarTodos(filtros = {}) {
    const where = filtros && filtros.status ? { status: filtros.status } : undefined;
    const entregas = await prisma.entrega.findMany({
      where,
      orderBy: { id: 'asc' },
      include: includeHistorico
    });
    return entregas.map(formatarEntrega);
  }

  /**
   * Busca uma entrega pelo id.
   */
  async buscarPorId(id) {
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) return null;

    const entrega = await prisma.entrega.findUnique({
      where: { id: numId },
      include: includeHistorico
    });
    return entrega ? formatarEntrega(entrega) : null;
  }

  /**
   * Cria uma nova entrega (e os eventos iniciais do histórico).
   */
  async criar(dados) {
    const nova = await prisma.entrega.create({
      data: {
        descricao: dados.descricao,
        origem: dados.origem,
        destino: dados.destino,
        status: dados.status,
        motoristaId: dados.motoristaId ?? null,
        historico: {
          create: (dados.historico || []).map((evento) => ({
            data: evento.data,
            descricao: evento.descricao
          }))
        }
      },
      include: includeHistorico
    });
    return formatarEntrega(nova);
  }

  /**
   * Atualiza uma entrega existente, substituindo o histórico quando informado.
   */
  async atualizar(id, dadosAtualizados) {
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) return null;

    const existente = await prisma.entrega.findUnique({ where: { id: numId } });
    if (!existente) return null;

    const data = {};
    if ('status' in dadosAtualizados) data.status = dadosAtualizados.status;
    if ('motoristaId' in dadosAtualizados) data.motoristaId = dadosAtualizados.motoristaId;
    if ('historico' in dadosAtualizados) {
      data.historico = {
        deleteMany: {},
        create: (dadosAtualizados.historico || []).map((evento) => ({
          data: evento.data,
          descricao: evento.descricao
        }))
      };
    }

    const atualizada = await prisma.entrega.update({
      where: { id: numId },
      data,
      include: includeHistorico
    });
    return formatarEntrega(atualizada);
  }
}
