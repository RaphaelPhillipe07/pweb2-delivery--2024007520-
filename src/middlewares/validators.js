import { body } from 'express-validator';

export const regrasEntrega = [
  body('descricao')
    .trim()
    .notEmpty()
    .withMessage('A descrição é obrigatória')
    .isLength({ max: 200 })
    .withMessage('A descrição deve ter no máximo 200 caracteres'),
  body('origem')
    .trim()
    .notEmpty()
    .withMessage('A origem é obrigatória')
    .isLength({ max: 120 })
    .withMessage('A origem deve ter no máximo 120 caracteres'),
  body('destino')
    .trim()
    .notEmpty()
    .withMessage('O destino é obrigatório')
    .isLength({ max: 120 })
    .withMessage('O destino deve ter no máximo 120 caracteres')
];

export const regrasMotorista = [
  body('nome')
    .trim()
    .notEmpty()
    .withMessage('O nome é obrigatório')
    .isLength({ max: 120 })
    .withMessage('O nome deve ter no máximo 120 caracteres'),
  body('cpf')
    .trim()
    .notEmpty()
    .withMessage('O CPF é obrigatório')
    .isLength({ max: 20 })
    .withMessage('O CPF deve ter no máximo 20 caracteres')
];
