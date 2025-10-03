import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn } from 'drizzle-orm/pg-core';


export function firstElem<T>(array: T[]): T | undefined {
    return array[0];
}

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}