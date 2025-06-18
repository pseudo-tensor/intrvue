import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routesv1 from './routes/v1';

const app: Application = express();

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(cookieParser());
app.use('/api/v1', routesv1);

export default app;
