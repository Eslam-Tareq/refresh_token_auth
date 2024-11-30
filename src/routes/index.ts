import { Express } from 'express';
import authRouter from './authRoutes';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
};

export default mountRoutes;
