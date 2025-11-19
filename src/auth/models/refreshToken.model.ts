import db from '../../db/db';
import { refreshTokens } from '../../db/schema';
import { eq } from 'drizzle-orm';

export class RefreshTokenModel {
    static async store(userId: string, token: string, expiresAt: Date) {
        return db.insert(refreshTokens).values({ userId, token, expiresAt });
    }

    static async revoke(token: string) {
        return db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    }

    static async update(token: string, newExpiresAt: Date) {
        return db
            .update(refreshTokens)
            .set({ expiresAt: newExpiresAt })
            .where(eq(refreshTokens.token, token));
    }

    static async revokeAllForUser(userId: string) {
        return db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }

    static async exists(token: string) {
        return db.query.refreshTokens.findFirst({
            where: eq(refreshTokens.token, token)
        });
    }

    static async isValid(token: string): Promise<Boolean> {
        const item = await this.exists(token);
        if (!item) return false;
        return new Date() < new Date(item.expiresAt);
    }
}
