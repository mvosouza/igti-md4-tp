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
const depositRouter = async (req, res) => {
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
const withdrawRouter = async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;

    if (value < 0) throw new Error('The withdraw value must be bigger than 0.');

    const account = await getAccount(agencia, conta);

    if (!account) {
      res.status(404).send('Account not found!');
      return;
    }

    if (account.balance - value < 0) {
      res.status(200).send('Account with insufficient funds!');
      return;
    }

    const { balance } = await accountsModel.findOneAndUpdate(
      { agencia, conta },
      { ...account, balance: account.balance - value },
      { new: true }
    );

    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Item 6
const balenceRouter = async (req, res) => {
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

export { depositRouter, withdrawRouter, balenceRouter };
