import http from 'http';
import {
    TEST,
    AUTH_SERVER_LABEL,
    NODE_ENV,
    POSTGRES_PORT,
    pool,
    authServer
} from './config/config';
import './config/logging';
import authApplication from './authApplication';

export let httpServer: ReturnType<typeof http.createServer>;
httpServer = http.createServer(authApplication);

export const Main = async () => {
    logging.log(
        '------------------------------------------',
    );
    logging.log(`Initializing auth Server in ${NODE_ENV} mode`, AUTH_SERVER_LABEL);
    logging.log(
        '------------------------------------------',
    );
    logging.log(
        '------------------------------------------'
    );
    logging.log('Initializing connection to Postgres', AUTH_SERVER_LABEL);
    logging.log(
        '------------------------------------------'
    );
    if (!TEST) {
        try {
            const client = await pool.connect();
            logging.log('------------------------------------------');
            logging.log(
                `PostgreSQL connection successfully on port:${POSTGRES_PORT}`, AUTH_SERVER_LABEL
            );
            logging.log('------------------------------------------');
            client.release();
        } catch (error) {
            logging.log(
                '------------------------------------------',
            );
            logging.info('Unable to connect to Postgres', AUTH_SERVER_LABEL);
            logging.error(error);
            logging.log(
                '------------------------------------------',
            );
        }
    }

    httpServer.listen(authServer.SERVER_PORT, () => {
        logging.log(
            '------------------------------------------',
        );
        logging.log(
            `Server is running at http://${authServer.SERVER_HOSTNAME}:${authServer.SERVER_PORT}`, AUTH_SERVER_LABEL
        );
        logging.log(
            '------------------------------------------',
        );
    });
};

export const Shutdown = (callback: any) =>
    httpServer &&
    httpServer.close((err) => {
        if (err) {
            logging.error(`Error shutting down ${AUTH_SERVER_LABEL}:`, err);
            return callback(err);
        }
        logging.log('Server shut down gracefully', AUTH_SERVER_LABEL);
        callback();
    });

Main();
