import { Request, Response, NextFunction } from 'express';
// import { AuthorizedUser } from '../types/user';
import { JWTPayload } from '../types/user';

declare global {
    namespace Express {
        interface Request {
            declaredMethod?: string;
            // authorizedUser: AuthorizedUser | undefined;
            authorizedUser: JWTPayload | undefined;
        }
    }
}

export function declareHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.declaredMethod = undefined;
    req.authorizedUser = undefined;

    next();
}
