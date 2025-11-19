import dotenv from 'dotenv';
import { Client, Pool } from 'pg';

dotenv.config();


export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const PRODUCTION = process.env.NODE_ENV === 'production';
export const TEST = process.env.NODE_ENV === 'test';
export const NODE_ENV: string = process.env.NODE_ENV?.toUpperCase() || '';

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ''; // 'default_refresh_token';

// Postgres Configuration
export const POSTGRES_USER = process.env.POSTGRES_USER || '';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
export const POSTGRES_HOST = process.env.POSTGRES_HOST || '';
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || '';
export const POSTGRES_PORT = process.env.POSTGRES_PORT || 5433;

export const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`;

// Main Server Configuration
export const MAIN_SERVER_LABEL = '| MAIN SERVER |';
export const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 3000;
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';

export const server = {
    SERVER_HOSTNAME,
    SERVER_PORT
};

// Auth Server Configuration
export const AUTH_SERVER_LABEL = '| AUTH SERVER |';
export const AUTH_SERVER_PORT = process.env.AUTH_SERVER_PORT
    ? Number(process.env.AUTH_SERVER_PORT)
    : 4000;
export const AUTH_SERVER_HOSTNAME =
    process.env.AUTH_SERVER_HOSTNAME || 'localhost';

export const authServer = {
    SERVER_HOSTNAME: AUTH_SERVER_HOSTNAME,
    SERVER_PORT: AUTH_SERVER_PORT
};

export const pool = new Pool({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: Number(POSTGRES_PORT) || 5433,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60
});

export const client = new Client({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT) || 5433,
    database: POSTGRES_DATABASE
});

export const MAX_PRICE = 10000;
export const MIN_PRICE = 0;
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;

// CORS Configuration
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:4000', 'https://studio.apollographql.com'];

export const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
export const ALLOWED_HEADERS = [
    'Content-Type',
    'Authorization',
    'Origin',
    'X-Requested-With',
    'Accept'
];

export const CORS_OPTIONS = {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ALLOWED_METHODS,
    allowedHeaders: ALLOWED_HEADERS,
    credentials: true,
    optionsSuccessStatus: 204
};

// Cloudinary Configuration
export const CLOUDINARY = {
    CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME || '',
    API_KEY : process.env.CLOUDINARY_API_KEY || '',
    API_SECRET : process.env.CLOUDINARY_API_SECRET || '',
    URL : process.env.CLOUDINARY_URL || ''
}