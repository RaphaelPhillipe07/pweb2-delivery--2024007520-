import { validationResult } from 'express-validator';
import { ServiceError } from '../services/entregasService.js';
import { STATUS_ENTREGA } from '../utils/formato.js';

export class EntregasController {
  constructor(service, motoristasService) {
    this.service = service;
    this.motoristasService = motoristasService;
  }

  listar = async (req, res, next) => {
    try {
      const filtroStatus = typeof req.query.status === 'string' ? req.query.status : '';
      const entregas = await this.service.listar(filtroStatus || undefined);
      const motoristas = await this.motoristasService.listar();
      const motoristasPorId = Object.fromEntries(motoristas.map((m) => [m.id, m]));

      return res.render('entregas/index', {
        titulo: 'Entregas',
        entregas,
        filtroStatus,
        statusDisponiveis: STATUS_ENTREGA,
        motoristasPorId
      });
    } catch (err) {
      next(err);
    }
  };

  nova = async (req, res, next) => {
    try {
      return res.render('entregas/nova', {
        titulo: 'Nova entrega',
        dados: { descricao: '', origem: '', destino: '' },
        erros: []
      });
    } catch (err) {
      next(err);
    }
  };

  criar = async (req, res, next) => {
    const dados = {
      descricao: req.body.descricao || '',
      origem: req.body.origem || '',
      destino: req.body.destino || ''
    };

    const errosValidacao = validationResult(req);
    if (!errosValidacao.isEmpty()) {
      return res.status(400).render('entregas/nova', {
        titulo: 'Nova entrega',
        dados,
        erros: errosValidacao.array().map((erro) => erro.msg)
      });
    }

    try {
      const novaEntrega = await this.service.criar(dados);
      req.flash('sucesso', `Entrega #${novaEntrega.id} criada com sucesso.`);
      return res.redirect(303, `/entregas/${novaEntrega.id}`);
    } catch (err) {
      if (err instanceof ServiceError) {
        return res.status(err.statusCode).render('entregas/nova', {
          titulo: 'Nova entrega',
          dados,
          erros: [err.message]
        });
      }
      next(err);
    }
  };

  detalhe = async (req, res, next) => {
    try {
      const { id } = req.params;
      const entrega = await this.service.buscarPorId(id);
      const motorista = entrega.motoristaId
        ? await this.motoristasService.buscarPorId(entrega.motoristaId)
        : null;
      const motoristas = await this.motoristasService.listar();

      return res.render('entregas/detalhe', {
        titulo: `Entrega #${entrega.id}`,
        entrega,
        motorista,
        motoristas: motoristas.filter((m) => m.status === 'ATIVO')
      });
    } catch (err) {
      if (err instanceof ServiceError && err.statusCode === 404) {
        return res.status(404).render('erros/404', {
          titulo: 'Entrega não encontrada',
          mensagem: err.message
        });
      }
      next(err);
    }
  };

  avancar = async (req, res, next) => {
    const { id } = req.params;
    try {
      const atualizada = await this.service.avancar(id);
      req.flash('sucesso', `Entrega #${atualizada.id} avançada para ${atualizada.status}.`);
      return res.redirect(303, `/entregas/${atualizada.id}`);
    } catch (err) {
      if (err instanceof ServiceError) {
        req.flash('erro', err.message);
        return res.redirect(303, `/entregas/${id}`);
      }
      next(err);
    }
  };

  cancelar = async (req, res, next) => {
    const { id } = req.params;
    try {
      const cancelada = await this.service.cancelar(id);
      req.flash('sucesso', `Entrega #${cancelada.id} cancelada.`);
      return res.redirect(303, `/entregas/${cancelada.id}`);
    } catch (err) {
      if (err instanceof ServiceError) {
        req.flash('erro', err.message);
        return res.redirect(303, `/entregas/${id}`);
      }
      next(err);
    }
  };

  atribuir = async (req, res, next) => {
    const { id } = req.params;
    try {
      const atualizada = await this.service.atribuir(id, req.body.motoristaId);
      req.flash('sucesso', `Motorista atribuído à entrega #${atualizada.id}.`);
      return res.redirect(303, `/entregas/${atualizada.id}`);
    } catch (err) {
      if (err instanceof ServiceError) {
        req.flash('erro', err.message);
        return res.redirect(303, `/entregas/${id}`);
      }
      next(err);
    }
  };
}
