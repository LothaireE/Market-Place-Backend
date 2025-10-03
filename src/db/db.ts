import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../config/config';
import * as schema from './schema/index';

const db = drizzle(pool, { schema });

export default db;
