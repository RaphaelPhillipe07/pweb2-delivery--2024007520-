import { prisma } from '../config/database.js';

/**
 * Contrato IMotoristasRepository (mesmo do Cap. 4), agora com persistência real:
 *
 *   listarTodos()   -> Promise<Motorista[]>
 *   buscarPorId(id) -> Promise<Motorista | null>
 *   buscarPorCpf(cpf) -> Promise<Motorista | null>
 *   criar(dados)    -> Promise<Motorista>
 */

function formatarMotorista(motorista) {
  return {
    id: motorista.id,
    nome: motorista.nome,
    cpf: motorista.cpf,
    status: motorista.status
  };
}

export class MotoristasRepositoryPrisma {
  /**
   * Lista todos os motoristas.
   */
  async listarTodos() {
    const motoristas = await prisma.motorista.findMany({ orderBy: { id: 'asc' } });
    return motoristas.map(formatarMotorista);
  }

  /**
   * Busca um motorista pelo id.
   */
  async buscarPorId(id) {
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) return null;

    const motorista = await prisma.motorista.findUnique({ where: { id: numId } });
    return motorista ? formatarMotorista(motorista) : null;
  }

  /**
   * Busca um motorista pelo CPF.
   */
  async buscarPorCpf(cpf) {
    const motorista = await prisma.motorista.findUnique({ where: { cpf } });
    return motorista ? formatarMotorista(motorista) : null;
  }

  /**
   * Cria um novo motorista.
   */
  async criar(dados) {
    const novo = await prisma.motorista.create({
      data: {
        nome: dados.nome,
        cpf: dados.cpf,
        status: dados.status || 'ATIVO'
      }
    });
    return formatarMotorista(novo);
  }
}
