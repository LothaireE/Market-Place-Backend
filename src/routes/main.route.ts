import { Router } from 'express';
import HealthCheck from '../controller/main.controller';
import { verifyAccessToken } from '../middlewares/authentication/verifyAccessToken';

const mainRouter = Router();
    
mainRouter.get('/main/healthcheck', HealthCheck.healthCheck);

// For demonstration purposes, this route is protected and requires a valid token.
// login to get an access token and use it in the Authorization header as Bearer <token>
mainRouter.get(
    '/main/healthcheck/details',
    verifyAccessToken(),
    HealthCheck.healthCheckWithDetails
);

export default mainRouter;
