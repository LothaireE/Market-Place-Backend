import { Request, Response } from 'express';

class HealthController {
    static healthCheck(req: Request, res: Response) {
        return res.status(200).json({
            message: 'API is running',
            timestamp: new Date().toISOString()
        });
    }

    static healthCheckWithDetails(req: Request, res: Response) {
        if (!req.authorizedUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { username } = req.authorizedUser;

        return res.status(200).json({
            message: `Detailed health performed for user: ${username}`,
            details: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                timestamp: new Date().toISOString()
            }
        });
    }
}
export default HealthController;
