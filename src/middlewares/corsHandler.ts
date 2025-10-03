import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle CORS requests and secure the API.
 * Determine what has access to the API and what to do with certain requests.
 */
export function corsHandler(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'POST, GET, PUT, DELETE, PATCH'
        );
        return res.status(200).json({}); // No content for preflight requests
    }

    next(); // Continue on to the next piece of middleware or route handler
}
