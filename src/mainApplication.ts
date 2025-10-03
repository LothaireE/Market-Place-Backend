import express from 'express';
import { loggingHandler } from './middlewares/loggingHandler';
import { corsHandler } from './middlewares/corsHandler';
import { declareHandler } from './middlewares/declareHandler';
// import setupRoutes from './routes/routes';

const mainApplication = express();

mainApplication.use(
    express.urlencoded({ extended: true }),
    express.json(),
    loggingHandler,
    corsHandler,
    declareHandler
);

// setupRoutes(mainApplication); // setupRoutes(controllers, mainApplication, routes);

export default mainApplication;
