import db from '../db/db';
// import { AuthorizedUser } from './user';
import { JWTPayload } from './user';
import type { Loaders } from '../middlewares/loaders';

export type GraphQLContext = {
    db: typeof db;
    token: JWTPayload | null;
    loaders: Loaders
    // token: AuthorizedUser | null;
};
