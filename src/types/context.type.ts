import db from '../db/db';
// import { AuthorizedUser } from './user';
import { JWTPayload } from './user';

export type GraphQLContext = {
    db: typeof db;
    token: JWTPayload | null;
    // token: AuthorizedUser | null;
};
