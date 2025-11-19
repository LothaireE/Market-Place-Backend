import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from '../config/config';
import { TEST, PRODUCTION } from '../config/config';
import { JWTPayload } from '../types/user';
import { Response } from 'express';


type AccessTokenPayload = {
    subject: string;
    username: string;
    source: 'login' | 'refresh' | 'test';
    email?: string;
    role?: string;
};

type RefreshTokenPayload = {
    subject: string;
    username: string;
    email?: string;
    role?: string;
};

export function generateAccessToken(
    payload: AccessTokenPayload
): string {
    !TEST && logging.info(`source: ${payload.source}`);
    if (payload.source === 'test')
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: '60min' // '1min'
        });

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '60min' // '15min'
    });
}

export function generateRefreshToken(payload:RefreshTokenPayload): string {
    return jwt.sign({...payload, source: 'refresh' },REFRESH_TOKEN_SECRET,{
            expiresIn: '30d'
    });
}

export function verifyRefreshToken(refreshToken: string) { // route "api/auth/me" it should be verifyAccessToken
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as RefreshTokenPayload & { source: string };
}

export function addDaysFromNow(days: number = 7) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function decodeAccessToken(authHeader?: string) {
    if (!authHeader) return null;
    try {
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        return decoded;
    } catch {
        return null;
    }
}

export const newJti = () => randomUUID();

export function setRefreshCookie(
    res: Response, 
    token: string, 
    path: string = "/", 
    name: string = 'refresh_token'
) {
    return res.cookie(name, token, {
        httpOnly: true,
        secure: PRODUCTION,
        sameSite: "lax", //'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: path
    })
}


export function clearRefreshCookie (res: Response, path: string = "/", name: string = 'refresh_token') {
    return res.clearCookie(name, {
        path: path,
        secure: PRODUCTION,
        sameSite: "lax",
        httpOnly: true
    });
}
