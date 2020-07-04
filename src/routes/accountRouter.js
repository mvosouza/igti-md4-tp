import express from 'express';
import {
  depositRoute,
  withdrawRoute,
  balenceRoute,
  deleteAccountRoute,
  transferRoute,
  balanceAverageRoute,
  lowestBalanceClientsRoute,
  biggestBalanceClientsRoute,
  transferClientBiggestBalanceRoute,
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

//Mostrar X clientes de menor saldo
router.get('/lowestBalanceClients/:limit', lowestBalanceClientsRoute);

//Mostrar X clientes de maior saldo
router.get('/biggestBalanceClients/:limit', biggestBalanceClientsRoute);

//Tranferir o cliente com maior saldo de cada agencia para a agencia 99
router.patch(
  '/transfer/biggestBalancePerAgency',
  transferClientBiggestBalanceRoute
);

export default router;
