import { validationResult } from 'express-validator';
import { ServiceError } from '../services/entregasService.js';

export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  listar = async (req, res, next) => {
    try {
      const motoristas = await this.service.listar();
      return res.render('motoristas/index', {
        titulo: 'Motoristas',
        motoristas
      });
    } catch (err) {
      next(err);
    }
  };

  novo = async (req, res, next) => {
    try {
      return res.render('motoristas/novo', {
        titulo: 'Novo motorista',
        dados: { nome: '', cpf: '' },
        erros: []
      });
    } catch (err) {
      next(err);
    }
  };

  criar = async (req, res, next) => {
    const dados = {
      nome: req.body.nome || '',
      cpf: req.body.cpf || ''
    };

    const errosValidacao = validationResult(req);
    if (!errosValidacao.isEmpty()) {
      return res.status(400).render('motoristas/novo', {
        titulo: 'Novo motorista',
        dados,
        erros: errosValidacao.array().map((erro) => erro.msg)
      });
    }

    try {
      const novoMotorista = await this.service.criar(dados);
      req.flash('sucesso', `Motorista ${novoMotorista.nome} cadastrado com sucesso.`);
      return res.redirect(303, '/motoristas');
    } catch (err) {
      if (err instanceof ServiceError) {
        return res.status(err.statusCode).render('motoristas/novo', {
          titulo: 'Novo motorista',
          dados,
          erros: [err.message]
        });
      }
      next(err);
    }
  };
}
