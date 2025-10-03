import { Request, Response, NextFunction } from 'express';

/**
 * Check any data in request body and compare it to a given schema to ensure the data is valid.
 * @param schema The data validation schema to check req.body against.
 * @returns An express request handler you can insert as middleware.
 */

export function validate(schema: any) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const validated = await schema.validateAsync(req.body);
            validated.email = validated.email.toLowerCase();
            req.body = validated;
        } catch (error) {
            logging.error('Validation error:', error);
            return res.status(400).json(error);
        }
        next();
    };
}
