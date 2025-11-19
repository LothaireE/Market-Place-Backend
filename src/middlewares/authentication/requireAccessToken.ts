import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/config';
import { JWTPayload } from '../../types/user';
import { ERROR_MESSAGES } from '../../constants/messages';

export function requireAccessToken(schema: any = null) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || '';

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token)
            return res
                .status(401)
                .json({ error: ERROR_MESSAGES.AUTH.ACCESS_TOKEN_REQUIRED });

        try {
            const verifiedUser = jwt.verify(
                token,
                JWT_SECRET
            ) as JWTPayload;
            req.authorizedUser = verifiedUser;
            next();
        } catch (error) {
            res.status(403).json({ error: ERROR_MESSAGES.AUTH.INVALID_TOKEN });
        }
    };
}
