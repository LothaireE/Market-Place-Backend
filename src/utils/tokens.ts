import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from '../config/config';
import { TEST } from '../config/config';
// import { AuthorizedUser } from '../types/user';
import { JWTPayload } from '../types/user';


export function generateAccessToken(
    userId: string,
    username: string,
    source: 'login' | 'refresh' | 'test'
): string {
    !TEST && logging.info(`source: ${source}`);
    if (source === 'test')
        jwt.sign({ userId, username, source }, JWT_SECRET, {
            expiresIn: '60min' // '1min'
        });

    return jwt.sign({ userId, username, source }, JWT_SECRET, {
        expiresIn: '60min' // '15min'
    });
}

export function generateRefreshToken(userId: string, username: string): string {
    return jwt.sign(
        { userId, username, source: 'refresh' },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: '7d'
        }
    );
}

export function verifyRefreshToken(refreshToken: string) {
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JWTPayload;
}

export function addDaysFromNow(days: number = 7) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function decodeAccessToken(authHeader?: string) {
    // console.log('authHeader ===> ', authHeader);
    if (!authHeader) return null;
    try {
        const token = authHeader.split(' ')[1];
        // console.log('token ===> ', token);
        // const decoded = jwt.verify(token, JWT_SECRET) as AuthorizedUser;
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        console.log('decoded ===> ', decoded);
        return decoded;
    } catch {
        return null;
    }
}
