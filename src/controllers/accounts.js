import accountsModel from '../models/account.js';

const FEE = {
  WITHDRAW: 1,
  TRANFER: 8,
};

const getAccount = async (agencia, conta) => {
  const accountDocument = await accountsModel.findOne({
    agencia,
    conta,
  });

  if (!accountDocument) return null;
  return accountDocument.toJSON();
};

//Item 4
const depositRoute = async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;

    if (value < 0) throw new Error('The deposit value must be bigger than 0.');

    const account = await getAccount(agencia, conta);
    if (!account) return res.status(404).send('Account not found!');

    const { balance } = await accountsModel.findOneAndUpdate(
      { agencia, conta },
      { ...account, balance: account.balance + value },
      { new: true }
    );

    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Item 5
const withdrawRoute = async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;

    if (value < 0) throw new Error('The withdraw value must be bigger than 0.');

    const account = await getAccount(agencia, conta);

    if (!account) return res.status(404).send('Account not found!');

    const newBalance = account.balance - value - FEE.WITHDRAW;
    if (newBalance < 0)
      return res.status(200).send('Account with insufficient funds!');

    const { balance } = await accountsModel.findOneAndUpdate(
      { agencia, conta },
      { ...account, balance: newBalance },
      { new: true }
    );

    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Item 6
const balenceRoute = async (req, res) => {
  try {
    const { agencia, conta } = req.params;

    const account = await getAccount(agencia, conta);
    if (!account) return res.status(404).send('Account not found!');

    res.status(200).json({ balance: account.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Item 7
const deleteAccountRoute = async (req, res) => {
  try {
    const { agencia, conta } = req.params;

    await accountsModel.findOneAndDelete({ agencia, conta });

    const numActiveAccounts = await accountsModel.countDocuments({ agencia });

    res.status(200).json({ result: numActiveAccounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Item 8
const transferRoute = async (req, res) => {
  try {
    const { originAccount, destinationAccount, value } = req.body;

    const origin = await getAccount(originAccount.agencia, originAccount.conta);
    if (!origin) return res.status(404).send('Origin account not found!');

    const destination = await getAccount(
      destinationAccount.agencia,
      destinationAccount.conta
    );
    if (!destination)
      return res.status(404).send('Destination account not found!');

    let fee = 0;
    if (origin.agencia !== destination.agencia) fee = FEE.TRANFER;

    const newOriginBalance = origin.balance - value - fee;
    if (newOriginBalance < 0)
      return res.status(200).send('Origin account with insufficient funds!');

    const originRes = await accountsModel.findByIdAndUpdate(
      origin._id,
      {
        balance: newOriginBalance,
      },
      { new: true }
    );

    await accountsModel.findByIdAndUpdate(destination._id, {
      balance: destination.balance + value,
    });

    res.json({ balance: originRes.balance });
  } catch (err) {
    res.status(500).json({ location: 'transfer', error: err });
  }
};

//Item 9
const balanceAverageRoute = async (req, res) => {
  try {
    const { agencia } = req.params;

    const balanceAverageCalc = await accountsModel.aggregate([
      { $match: { agencia: Number(agencia) } },
      { $group: { _id: '$agencia', balanceAverage: { $avg: '$balance' } } },
    ]);

    const agenciaResult = balanceAverageCalc[0];
    let balanceAverage = 0;
    if (agenciaResult) balanceAverage = agenciaResult.balanceAverage;

    res.json({ balanceAverage });
  } catch (error) {
    res.status(500).json({ location: 'balanceAverage', error: err });
  }
};

//Item 10
const lowestBalanceClientsRoute = async (req, res) => {
  try {
    const { limit } = req.params;
    const accounts = await accountsModel
      .find({}, { _id: 0, agencia: 1, conta: 1, balance: 1 })
      .sort({ balance: 1 })
      .limit(Number(limit));
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ location: 'lowestBalanceClients', error: err });
  }
};

//Item 11
const biggestBalanceClientsRoute = async (req, res) => {
  try {
    const { limit } = req.params;
    const accounts = await accountsModel
      .find({}, { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 })
      .sort({ balance: -1, name: 1 })
      .limit(Number(limit));
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ location: 'biggestBalanceClients', error: err });
  }
};

const transferClientBiggestBalanceRoute = async (req, res) => {
  try {
    const biggestBalancePerAgency = await accountsModel.aggregate([
      { $group: { _id: '$agencia', balance: { $max: '$balance' } } },
    ]);
    const filters = biggestBalancePerAgency.map(({ _id, balance }) => ({
      agencia: _id,
      balance,
    }));
    const accounts = await accountsModel
      .find({
        $or: [...filters],
      })
      .lean();

    const accountsIds = accounts.map(({ _id }) => _id);
    await accountsModel.updateMany(
      {
        _id: { $in: [...accountsIds] },
      },
      { agencia: 99 }
    );

    const privateAccoutns = await accountsModel.find({ agencia: 99 }).lean();

    res.json(privateAccoutns);
  } catch (err) {
    res
      .status(500)
      .json({ location: 'transferClientBiggestBalance', error: err.message });
  }
};

export {
  depositRoute,
  withdrawRoute,
  balenceRoute,
  deleteAccountRoute,
  transferRoute,
  balanceAverageRoute,
  lowestBalanceClientsRoute,
  biggestBalanceClientsRoute,
  transferClientBiggestBalanceRoute,
};
