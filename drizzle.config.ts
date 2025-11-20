import { defineConfig } from 'drizzle-kit';

/**
@author
https://orm.drizzle.team/docs/kit-overview

@package 
drizzle 

list of commands to handle migrations

npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit push
npx drizzle-kit pull
npx drizzle-kit drop


drizzle-kit generate	lets you generate SQL migration files based on your Drizzle schema either upon declaration or on subsequent changes, see here.
drizzle-kit migrate	lets you apply generated SQL migration files to your database, see here.
drizzle-kit pull	lets you pull(introspect) database schema, convert it to Drizzle schema and save it to your codebase, see here
drizzle-kit push	lets you push your Drizzle schema to database either upon declaration or on subsequent schema changes, see here
npx drizzle-kit drop    drop the migrations

*/
export default defineConfig({
    dialect: 'postgresql',
    schema: ['./src/db/schema', './src/db/schema/relations/**/*.ts'],
    out: './src/db/migrations/',
    migrations: {
        table: 'schema_migrations',
        schema: 'public'
    },
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});
