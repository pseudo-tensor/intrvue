import express, { Application } from 'express';
import cors from 'cors';
import routesv1 from './routes/v1';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', routesv1);

export default app;
