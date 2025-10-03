import { Request, Response, NextFunction } from 'express';


export function routeNotFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(
        `Route not found: ${req.method} ${req.originalUrl}`
    );

    logging.error(error);

    return res.status(404).json({
        error: error.message,
        timestamp: new Date().toISOString()
    });
}
