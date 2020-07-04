import express from 'express';
import {
  connectToMongoDB,
  resetAccountsCollection,
} from './config/dbConfig.js';
import accountsRouter from './routes/accountRouter.js';

const port = 3000;
const app = express();

app.use(express.json());
app.use('/accounts', accountsRouter);

app.listen(port, async () => {
  await connectToMongoDB();
  await resetAccountsCollection();
  console.log(`Web API is running on port ${port}`);
});
