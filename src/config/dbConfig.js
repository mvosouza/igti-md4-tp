import mongoose from 'mongoose';
import fs from 'fs';
import accountModel from '../models/account.js';

const connectToMongoDB = async () => {
  //Conectar ao MongoDB pelo Mongoose
  await mongoose.connect(
    'mongodb+srv://igtiuser:bootcamp@cluster0.eiinm.mongodb.net/my-bank?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
};

const resetAccountsCollection = async () => {
  //Delete all recods
  let isDeleted = false;
  try {
    const res = await accountModel.deleteMany();
    isDeleted = res.ok;
  } catch (err) {
    console.log(err);
  }

  if (isDeleted) {
    //Insert all records
    try {
      const file = await fs.promises.readFile('./accounts.json');
      const accounts = JSON.parse(file);
      await accountModel.insertMany(accounts);
      console.log(`Database was reseted.`);
    } catch (err) {
      console.log(err);
    }
  }
};

export { connectToMongoDB, resetAccountsCollection };
