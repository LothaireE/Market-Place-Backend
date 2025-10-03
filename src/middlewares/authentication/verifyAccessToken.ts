import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/config';
// import { AuthorizedUser } from '../../types/user';
import { JWTPayload } from '../../types/user';
import { ERROR_MESSAGES } from '../../constants/messages';

export function verifyAccessToken(schema: any = null) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res
                .status(401)
                .json({ error: ERROR_MESSAGES.AUTH.MISSING_HEADER });

        const token = authHeader.split(' ')[1];

        try {
            const verifiedUser = jwt.verify(
                token,
                JWT_SECRET
            // ) as AuthorizedUser;
            ) as JWTPayload;
            req.authorizedUser = verifiedUser;
            next();
        } catch (error) {
            res.status(403).json({ error: ERROR_MESSAGES.AUTH.INVALID_TOKEN });
        }
    };
}
