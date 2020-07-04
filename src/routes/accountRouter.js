import express from 'express';
import {
  depositRoute,
  withdrawRoute,
  balenceRoute,
  deleteAccountRoute,
  transferRoute,
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

export default router;
