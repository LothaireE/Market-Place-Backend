import express from 'express';
import { loggingHandler } from './middlewares/loggingHandler';
import { corsHandler } from './middlewares/corsHandler';
import { declareHandler } from './middlewares/declareHandler';
import { setupAuthRoutes } from './routes/routes';
import cookieParser from 'cookie-parser';

const authApplication = express();

authApplication.use(
    express.urlencoded({ extended: true }),
    express.json(),
    loggingHandler,
    corsHandler,
    declareHandler,
    cookieParser()
);

setupAuthRoutes(authApplication); // setupRoutes(controllers, authApplication, routes);

export default authApplication;
