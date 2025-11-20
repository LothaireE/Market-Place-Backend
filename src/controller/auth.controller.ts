import { Request, Response } from 'express';
import { UserType } from '../types/user';
import {
    addDaysFromNow,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    setRefreshCookie,
    clearRefreshCookie
} from '../utils/tokens';
import { AUTH_SERVER_LABEL } from '../config/config';
import AuthService from '../auth/services/auth.services';
import { RefreshTokenModel } from '../auth/models/refreshToken.model';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';


export const toPublicUser = (user: UserType) => ({
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
            setRefreshCookie(res, refreshToken);
            return res.status(200).json({
                message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
                data: {
                    user: safeUser,
                    accessToken,
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
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            return res
                .status(401)
                .json({ error: ERROR_MESSAGES.AUTH.REFRESH_TOKEN_REQUIRED });
        }


        try {
            const payload = verifyRefreshToken(refreshToken); // a decoded token

            const valid = await RefreshTokenModel.isValid(refreshToken);

            if (!valid) { // need to add revocation even without token found
                return res.status(403).json({
                    error: ERROR_MESSAGES.AUTH.REFRESH_TOKEN_NOT_FOUND
                });
            }

            await RefreshTokenModel.revoke(refreshToken);

            // res.clearCookie('refresh_token', {path: '/'});
            clearRefreshCookie(res)

            const newAccessToken = generateAccessToken({
                    subject: payload.subject,
                    username: payload.username,
                    source:'refresh'
            });

            const newRefreshToken = generateRefreshToken({
                subject: payload.subject,
                username: payload.username
            });

            const expiresAt = addDaysFromNow();

            await RefreshTokenModel.store(
                payload.subject,
                newRefreshToken,
                expiresAt
            );

            setRefreshCookie(res, newRefreshToken);

            return res.status(201).json({
                message: SUCCESS_MESSAGES.AUTH.TOKEN_REFRESHED,
                accessToken: newAccessToken,
            });
        } catch (error) {
            logging.error(error, AUTH_SERVER_LABEL);
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
    }

    static async logout(req: Request, res: Response) {
        const token = req.cookies?.refresh_token;
           
        if (token){
            try {
                await RefreshTokenModel.revoke(token);
            } catch (error) {
                logging.error(error, AUTH_SERVER_LABEL);
            }
        }
        
        clearRefreshCookie(res)
        logging.info('User logged out', AUTH_SERVER_LABEL);
        return res.status(204).json({ok: true, message: 'User logged out'});
    }
}

export default AuthController;
