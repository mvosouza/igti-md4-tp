import express from 'express';
import {
  depositRouter,
  withdrawRouter,
  balenceRouter,
} from '../controllers/accounts.js';

const router = express.Router();

//Depósito
router.patch('/deposit', depositRouter);

//Saque
router.patch('/withdraw', withdrawRouter);

//Saldo
router.get('/:agencia/:conta/balance', balenceRouter);

export default router;
