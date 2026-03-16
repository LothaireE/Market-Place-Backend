import { Request, Response, NextFunction } from 'express';
import { TEST } from '../config/config';

export function loggingHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (TEST) return next(); // Skip logging in test mode
    logging.log(
        `Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );
    res.on('finish', () => {
        logging.log(
            `Responded - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
        );
    });

    next();
}
