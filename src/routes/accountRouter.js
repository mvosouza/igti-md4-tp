import express from 'express';
import {
  depositRoute,
  withdrawRoute,
  balenceRoute,
} from '../controllers/accounts.js';

const router = express.Router();

//Depósito
router.patch('/deposit', depositRoute);

//Saque
router.patch('/withdraw', withdrawRoute);

//Saldo
router.get('/:agencia/:conta/balance', balenceRoute);

export default router;
