import request from 'supertest';
import { Shutdown } from '../../src/authServer';
import authApplication from '../../src/authApplication';
import AuthService from '../../src/auth/services/auth.services';
import * as AuthControllerModule from '../../src/controller/auth.controller';
import * as TokensModule from '../../src/utils/tokens';

jest.mock('../../src/auth/services/auth.services');

describe('Auth Routes Integration Tests', () => {
    // afterAll(async () => {
    //     await new Promise<void>((resolve, reject) => {
    //         Shutdown((err?: unknown) => {
    //             if (err) reject(err);
    //             else resolve();
    //         });
    //     });
    // });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should start with the proper environment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(authApplication).toBeDefined();
    }, 10000);



    it('POST /api/auth/signup creates a new user', async () => {
        const fakeReqBody = {
                username: 'jimi',
                email: 'test@mail.com',
                password: '123456',
                confirmPassword: '123456',
                avatarUrl: 'https://example.com/avatar.jpg'
            }

        const fakeNewUser = {
            id: '1',
            username: 'jimi',
            email: 'test@mail.com',
            password: '123456',
            avatarUrl: 'https://example.com/avatar.jpg',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const fakePublicUser = {
                username: 'jimi',
                email: 'test@mail.com'
            }

        const signupMock = AuthService.signup as jest.MockedFunction<typeof AuthService.signup>;
        signupMock.mockResolvedValueOnce(fakeNewUser as any);

        const toPublicUserSpy = jest.spyOn(AuthControllerModule, 'toPublicUser').mockReturnValue(fakePublicUser);

        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send(fakeReqBody);
        
        expect(AuthService.signup).toHaveBeenCalledTimes(1);
        expect(AuthService.signup).toHaveBeenCalledWith({
            username: 'jimi',
            email: 'test@mail.com',
            password: '123456',
            avatarUrl: 'https://example.com/avatar.jpg'
        });

        expect(toPublicUserSpy).toHaveBeenCalledTimes(1);
        expect(toPublicUserSpy).toHaveBeenCalledWith(fakeNewUser);


        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User signed up successfully');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toMatchObject({
            username: 'jimi',
            email: 'test@mail.com'
        });
    });

    it('POST /api/auth/signup fails when username is missing/invalid', async () => {
        const fakeReqBody = {
            username: 'j',
            email: 'test@mail.com',
            password: '123456',
            confirmPassword: '123456',
            avatarUrl: 'https://example.com/avatar.jpg'
        }
        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send(fakeReqBody);

        expect(res.statusCode).toBe(400);
    });

    it('POST /api/auth/signup fails with invalid email', async () => {
        const fakeReqBody = {
            username: 'jimi',
            email: 'test#mail.com',
            password: '123456',
            confirmPassword: '123456',
            avatarUrl: 'https://example.com/avatar.jpg'
        }
        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send(fakeReqBody);

        expect(res.statusCode).toBe(400);
    });

    xit('POST /api/auth/signup fails with invalid password', async () => {
        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send({
                username: 'jimi',
                email: 'invalid-password@mail.com',
                password: '12345'
            });

        expect(res.statusCode).toBe(400);
    });

    it('POST /api/auth/login logs in an existing user', async () => {
        const fakeReqBody = {
            email: 'test@mail.com',
            password: '123456'
        };
        const user = {
            id: 'user-id',
            email: 'test@mail.com',
            username: 'jimi'
        };
        const accessToken = 'access-token';
        const refreshToken = 'refresh-token';

        const loginMock = AuthService.login as jest.MockedFunction<typeof AuthService.login>;
        loginMock.mockResolvedValueOnce({
            user,
            accessToken,
            refreshToken
        } as any);

        const fakePublicUser = {
            username: 'jimi',
            email: 'test@mail.com'
        };
        const toPublicUserSpy = jest.spyOn(AuthControllerModule, 'toPublicUser').mockReturnValue(fakePublicUser);

        const setRefreshCookieSpy = jest.spyOn(TokensModule, 'setRefreshCookie');
        const res = await request(authApplication)
            .post('/api/auth/login')
            .send(fakeReqBody);

        expect(AuthService.login).toHaveBeenCalledTimes(1);
        expect(toPublicUserSpy).toHaveBeenCalledTimes(1);

        expect(setRefreshCookieSpy).toHaveBeenCalledTimes(1);
        expect(setRefreshCookieSpy).toHaveBeenCalledWith(expect.anything(), refreshToken);
        // expect(setRefreshCookieSpy).toHaveBeenCalledWith(res, refreshToken);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data).toHaveProperty('accessToken');

        expect(res.body.data.user).toMatchObject({
            username: 'jimi',
            email: 'test@mail.com'
        });

        const setCookieHeader = res.headers['set-cookie'];
        expect(setCookieHeader).toBeDefined();
    });

    it('POST /api/auth/login fails with wrong password', async () => {
        const res = await request(authApplication)
            .post('/api/auth/login')
            .send({
                email: 'test@mail.com',
                password: '12345'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('details',["Invalid or missing password."] );
    });

    it('POST /api/auth/login fails with invalid email format', async () => {
        const res = await request(authApplication)
            .post('/api/auth/login')
            .send({
                email: 'test#mail.com',
                password: '123456'
            });

        expect(res.statusCode).toBe(400);
    });

    it('returns 404 and a Route not found error for unknown routes', async () => {
        const res = await request(authApplication).get('/non-existent-route');
        expect(res.status).toBe(404);
        expect(res.body).toBeDefined();
        expect(res.body.error).toBeDefined();
        expect(String(res.body.error)).toContain('Route not found');
        expect(res.body.timestamp).toBeDefined();
    });
});
