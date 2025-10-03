// import dotenv from 'dotenv'
import db from './db/db';
import './config/logging';
import { server, pool, POSTGRES_PORT, NODE_ENV, MAIN_SERVER_LABEL } from './config/config';
import http from 'http';
import mainApplication from './mainApplication';
import { GraphQLContext } from './types/context.type';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { resolvers } from './graphql/mergedResolver';
import { typeDefs } from './graphql/mergedTypeDefs';
import { decodeAccessToken } from './utils/tokens';

export let httpServer: ReturnType<typeof http.createServer>;

httpServer = http.createServer(mainApplication);

const apolloServer = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
    formatError: (err) => {
        logging.error('from APOLLO SERVER');
        logging.error(JSON.stringify(err, null, 2));
        return err;
    }
});

export const Main = async () => {

    logging.log('------------------------------------------');
    logging.log(`Initializing Node Graphql API in ${NODE_ENV} mode`, MAIN_SERVER_LABEL);
    logging.log('------------------------------------------');

    await apolloServer.start();
    mainApplication.use(
        expressMiddleware(apolloServer, {
            context: async ({ req }): Promise<GraphQLContext> => {
                const token = decodeAccessToken(req.headers.authorization);
                // return { db, token };
                return { db, token };
            }
        })
    );
    logging.log('------------------------------------------');
    logging.log('Initializing connection to Postgres', MAIN_SERVER_LABEL);
    logging.log('------------------------------------------');
    try {
        const client = await pool.connect();
        logging.log('------------------------------------------');
        logging.log(
            `PostgreSQL connection successfully on port:${POSTGRES_PORT}`, MAIN_SERVER_LABEL
        );
        logging.log('------------------------------------------');
        // console.log('client ===> ', client);
        client.release();
    } catch (error) {
        logging.log('------------------------------------------');
        logging.error(`PostgreSQL connection failed:${error}`);
        logging.log('------------------------------------------');
        process.exit(1);
    }

    httpServer.listen(server.SERVER_PORT, () => {
        logging.log('------------------------------------------');
        logging.log(
            `Server is running at http://${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`, MAIN_SERVER_LABEL
        );
        logging.log('------------------------------------------');
    });
};

export const Shutdown = (callback: any) =>
    httpServer &&
    httpServer.close((err) => {
        if (err) {
            logging.error(`Error shutting down ${MAIN_SERVER_LABEL}:`, err);
            return callback(err);
        }
        logging.log('Server shut down gracefully', MAIN_SERVER_LABEL);
        callback();
    });

Main();
