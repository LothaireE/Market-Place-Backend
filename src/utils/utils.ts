import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import { JWTPayload } from '../types/user';
import { sellerProfiles } from '../db/schema';
import db from '../db/db';

export function firstElem<T>(array: T[]): T | undefined {
    return array[0];
}

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export async function isSeller(token:JWTPayload) {

        const {userId} = token

        if (!userId) return null;

        const sellerProfile = await db.query.sellerProfiles.findFirst({
            where: eq(sellerProfiles.userId, userId)
        })

        return sellerProfile ?? null;
}