import { Express } from 'express';
import healthCheckRoutes from './main.route';
import authRoutes from './auth.route';
import { routeNotFound } from '../middlewares/routeNotFound';

// // Single server way
// export default function setupRoutes(application: Express) {
//     application.use('/api', [healthCheckRoutes, authRoutes, bookRoutes]);
//     application.use(routeNotFound);
// }

// Dual server way
// starting base for any REST route outside of GraphQL
export default function setupRoutes(application: Express) {
    application.use('/api', [healthCheckRoutes]);
    application.use(routeNotFound);
}

// separated auth routes from graphql
export function setupAuthRoutes(application: Express) {
    application.use('/api/auth', [authRoutes]);
    application.use(routeNotFound);
}
