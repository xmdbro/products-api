import express from 'express';
import { productsRouter } from './routes/products';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/products', productsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});

export default app;