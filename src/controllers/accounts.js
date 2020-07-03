import accountsModel from '../models/account.js';

const getAccount = async (agencia, conta) => {
  const accountDocument = await await accountsModel.findOne({
    agencia,
    conta,
  });

  if (!accountDocument) {
    return null;
  }

  return accountDocument.toJSON();
};

//Item 4
const depositRoute = async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;

    if (value < 0) throw new Error('The deposit value must be bigger than 0.');

    const account = await getAccount(agencia, conta);
    if (!account) {
      res.status(404).send('Account not found!');
      return;
    }

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
    const FEE = 1;
    const { agencia, conta, value } = req.body;

    if (value < 0) throw new Error('The withdraw value must be bigger than 0.');

    const account = await getAccount(agencia, conta);

    if (!account) {
      res.status(404).send('Account not found!');
      return;
    }
    const newBalance = account.balance - value - FEE;
    if (newBalance < 0) {
      res.status(200).send('Account with insufficient funds!');
      return;
    }

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
    if (!account) {
      res.status(404).send('Account not found!');
      return;
    }

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

export { depositRoute, withdrawRoute, balenceRoute, deleteAccountRoute };
