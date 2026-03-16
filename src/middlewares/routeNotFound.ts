import { Request, Response, NextFunction } from 'express';
import { TEST } from '../config/config';


export function routeNotFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(
        `Route not found: ${req.method} ${req.originalUrl}`
    );

    if(!TEST)logging.error(error);

    return res.status(404).json({
        error: error.message,
        timestamp: new Date().toISOString()
    });
}
