import express from 'express';
import {
  depositRoute,
  withdrawRoute,
  balenceRoute,
  deleteAccountRoute,
  transferRoute,
  balanceAverageRoute,
} from '../controllers/accounts.js';

const router = express.Router();

//Depósito
router.patch('/deposit', depositRoute);

//Saque
router.patch('/withdraw', withdrawRoute);

//Saldo
router.get('/:agencia/:conta/balance', balenceRoute);

//Deleta uma conta
router.delete('/:agencia/:conta', deleteAccountRoute);

//Transferencia
router.patch('/transfer', transferRoute);

//Média do saldo de uma agencia
router.get('/balanceAverage/:agencia', balanceAverageRoute);

export default router;
