import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';

import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import errorHandler from './middlewares/errors';

const { PORT } = process.env;
const DB_ADDRESS = process.env.DB_ADDRESS || '';

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

mongoose.connect(DB_ADDRESS);

app.use('/product', productsRouter);
app.use('/order', ordersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});
