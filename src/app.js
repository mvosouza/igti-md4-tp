import express from 'express';
import {
  connectToMongoDB,
  resetAccountsCollection,
} from './config/dbConfig.js';

const port = 3000;
const app = express();

app.use(express.json());

app.get('', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  await connectToMongoDB();
  await resetAccountsCollection();
  console.log(`Web API is running on port ${port}`);
});
