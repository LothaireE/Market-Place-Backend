import { Request, Response } from 'express';
import { UserType } from '../types/user';
import {
    addDaysFromNow,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '../utils/tokens';
import { AUTH_SERVER_LABEL } from '../config/config';
import AuthService from '../auth/services/auth.services';
import { RefreshTokenModel } from '../auth/models/refreshToken.model';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';

export const toPublicUser = (user: UserType) => ({
    id: user.id,
    username: user.username,
    email: user.email
});

class AuthController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const { user, accessToken, refreshToken } = await AuthService.login(
                { email, password }
            );

            const safeUser = toPublicUser(user);
            return res.status(200).json({
                message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
                data: {
                    user: safeUser,
                    accessToken,
                    refreshToken
                }
            });
        } catch (error: any) {
            if (error.message === 'INVALID_CREDENTIALS')
                res.status(401).json({
                    error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
                });
            return res
                .status(500)
                .json({ error: ERROR_MESSAGES.COMMON.INTERNAL_ERROR });
        }
    }

    static async signup(req: Request, res: Response) {
        const { username, email, password, avatarUrl } = req.body;

        try {
            const newUser = await AuthService.signup({
                username,
                email,
                password,
                avatarUrl
            });
            const safeUser = toPublicUser(newUser);
            return res.status(201).json({
                message: SUCCESS_MESSAGES.AUTH.SIGNUP_SUCCESS,
                user: safeUser
            });
        } catch (error: any) {
            logging.error(error, AUTH_SERVER_LABEL);
            if (error.message === 'EMAIL_ALREADY_EXIST') {
                return res
                    .status(409)
                    .json({ error: ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS });
            }
            return res
                .status(500)
                .json({ error: ERROR_MESSAGES.COMMON.INTERNAL_ERROR });
        }
    }

    static async refreshToken(req: Request, res: Response) {
        const oldToken = req.body.token; // the refresh token rotation
        if (!oldToken)
            return res
                .status(401)
                .json({ error: ERROR_MESSAGES.AUTH.REFRESH_TOKEN_REQUIRED });

        try {
            const decodedToken = verifyRefreshToken(oldToken);

            const valid = await RefreshTokenModel.isValid(oldToken);
            if (!valid)
                res.status(403).json({
                    error: ERROR_MESSAGES.AUTH.REFRESH_TOKEN_NOT_FOUND
                });

            await RefreshTokenModel.revoke(oldToken);

            const newAccessToken = generateAccessToken(
                decodedToken.userId,
                decodedToken.username,
                'refresh'
            );

            const newRefreshToken = generateRefreshToken(
                decodedToken.userId,
                decodedToken.username
            );

            const expiresAt = addDaysFromNow();

            await RefreshTokenModel.store(
                decodedToken.userId,
                newRefreshToken,
                expiresAt
            );

            return res.status(201).json({
                message: SUCCESS_MESSAGES.AUTH.TOKEN_REFRESHED,
                data: {
                    accessToken: newAccessToken,
                    refreshTokens: newRefreshToken
                }
            });
        } catch (error) {
            logging.error(error, AUTH_SERVER_LABEL);
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
    }

    static async logout(req: Request, res: Response) {
        const token = req.body.token;
        res.status(400).json({ error: 'Refresh token is required for logout' });

        if (!token)
            res.status(400).json({
                error: 'Refresh token is required for logout'
            });

        try {
            await RefreshTokenModel.revoke(token);
            logging.info('User logged out successfully', AUTH_SERVER_LABEL);
            return res.status(204).end();
        } catch (error) {
            logging.error(error, AUTH_SERVER_LABEL);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default AuthController;
