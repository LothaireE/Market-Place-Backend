import request from 'supertest';
import { Shutdown } from '../../src/authServer';
import authApplication from '../../src/authApplication';

describe('Auth Routes Integration Tests', () => {
    afterAll((done) => {
        Shutdown(done); // Shutdown the server after tests
    });

    it('should start with the proper environment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(authApplication).toBeDefined();
    }, 10000);

    it('POST /api/auth/signup creates a new user', async () => {
        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send({
                name: 'jimi',
                email: 'test@mail.com',
                password: '123456', // min length of 6
                confirmPassword: '123456'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User signed up successfully');
    });

    it('POST /api/auth/signup fails with name too short', async () => {
        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send({
                name: 'j',
                email: 'test@mail.com',
                password: '123456',
                confirmPassword: '123456'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.details[0]).toBe('Invalid or missing name.');
    });

    it('POST /api/auth/signup fails with invalid email', async () => {
        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send({ name: 'jimi', email: 'test#mail.com', password: '123456' });
        expect(res.statusCode).toBe(400);
        expect(res.body.details[0]).toBe('Invalid or missing email.');
    });

    it('POST /api/auth/signup fails with invalid credentials', async () => {
        const res = await request(authApplication)
            .post('/api/auth/signup')
            .send({ name: 'jimi', email: 'test@mail.com', password: '12345' });
        expect(res.statusCode).toBe(400);
        expect(res.body.details[0]).toBe('Invalid or missing password.');
    });

    it('POST /api/auth/login logs in an existing user', async () => {
        const res = await request(authApplication)
            .post('/api/auth/login')
            .send({ email: 'test@mail.com', password: '123456' });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User logged in successfully');
    });

    it('POST /api/auth/login fails with invalid credentials', async () => {
        const res = await request(authApplication)
            .post('/api/auth/login')
            .send({ email: 'test@mail.com', password: '12345' });
        expect(res.statusCode).toBe(400);
        expect(res.body.details[0]).toBe('Invalid or missing password.');
    });

    it('POST /api/auth/login fails with invalid email', async () => {
        const res = await request(authApplication)
            .post('/api/auth/login')
            .send({ email: 'test#mail.com', password: '123456' });
        expect(res.statusCode).toBe(400);
        expect(res.body.details[0]).toBe('Invalid or missing email.');
    });
});
