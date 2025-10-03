import express from 'express';
import { loggingHandler } from './middlewares/loggingHandler';
import { corsHandler } from './middlewares/corsHandler';
import { declareHandler } from './middlewares/declareHandler';
import { setupAuthRoutes } from './routes/routes';

const authApplication = express();

authApplication.use(express.urlencoded({ extended: true }));
authApplication.use(express.json());
authApplication.use(loggingHandler);
authApplication.use(corsHandler);
authApplication.use(declareHandler);
setupAuthRoutes(authApplication); // setupRoutes(controllers, authApplication, routes);

export default authApplication;
