import express from 'express';
import { loggingHandler } from './middlewares/loggingHandler';
import { corsHandler } from './middlewares/corsHandler';
import { declareHandler } from './middlewares/declareHandler';
// import setupRoutes from './routes/routes';
import mainRouter from './routes/main.route';
import cookieParser from 'cookie-parser';
import { requireAccessToken } from './middlewares/authentication/requireAccessToken';

const mainApplication = express();

mainApplication.use(
    express.urlencoded({ extended: true }),
    express.json(),
    loggingHandler,
    corsHandler,
    declareHandler,
    cookieParser()
);

mainApplication.use("/api", requireAccessToken(), mainRouter);

// setupRoutes(mainApplication); // setupRoutes(controllers, mainApplication, routes);

export default mainApplication;
