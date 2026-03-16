// import { Shutdown } from '../../src/mainServer';
import application from '../../src/mainApplication';
import request from 'supertest';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

describe('Application', () => {

    it(
        'starts with the proper environment and application is defined',
        () => {
            expect(process.env.NODE_ENV).toBe('test');
            expect(application).toBeDefined();
        },
        10000
    );

    // it(
    //     'responds to OPTIONS with allowed methods including POST, GET, PUT, DELETE, PATCH',
    //     async () => {
    //         const res = await request(application).options('/');
    //         expect(res.status).toBe(200);

    //         const methodsHeader =
    //             res.headers['access-control-allow-methods'] ||
    //             res.headers['Access-Control-Allow-Methods'] ||
    //             '';

    //         // normalize, split and trim
    //         const methods = methodsHeader
    //             .toString()
    //             .split(',')
    //             .map((m: string) => m.trim().toUpperCase())
    //             .filter(Boolean);

    //         expect(methods).toEqual(
    //             expect.arrayContaining(['POST', 'GET', 'PUT', 'DELETE', 'PATCH'])
    //         );
    //     },
    //     10000
    // );

    it('returns 404 and a Route not found error for unknown routes', async () => {
        const res = await request(application).get('/non-existent-route');
        expect(res.status).toBe(404);
    });
});
