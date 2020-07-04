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

export {
  depositRoute,
  withdrawRoute,
  balenceRoute,
  deleteAccountRoute,
  transferRoute,
};
