/**
 * This is a basic Schema for validating login data. I can replace it with any other validation library at any given point.
 *
 * @remarks
 * Provides an asynchronous `validateAsync` method to validate
 *
 * @property validateAsync - Asynchronously validates the provided data object.
 * Throws an error with a `details` property containing validation messages if validation fails.
 */
import { ERROR_MESSAGES } from '../../constants/messages';
type signupData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatarUrl?: string | null
};

export const signupValidator = {
    async validateAsync(data: signupData) {
        const errors: string[] = [];

        if (
            !data.username ||
            typeof data.username !== 'string' ||
            data.username.trim() === '' ||
            data.username.length < 2
        ) {
            errors.push(ERROR_MESSAGES.AUTH.INVALID_USERNAME);
        }
        if (
            !data.email ||
            typeof data.email !== 'string' ||
            !data.email.includes('@')
        ) {
            errors.push(ERROR_MESSAGES.AUTH.INVALID_EMAIL);
        }

        if (
            !data.password ||
            typeof data.password !== 'string' ||
            data.password.length < 6
        ) {
            errors.push(ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
        }

        if (
            !data.confirmPassword ||
            typeof data.confirmPassword !== 'string' ||
            data.confirmPassword.length < 6 ||
            data.confirmPassword !== data.password
        ) {
            errors.push(ERROR_MESSAGES.AUTH.INVALID_CONFIRM_PASSWORD);
        }

        if (errors.length > 0) {
            const error = new Error('Validation failed');
            (error as any).details = errors;
            throw error;
        }

        const validData = {
            username: data.username,
            email: data.email.trim(),
            password: data.password,
            avatarUrl: data.avatarUrl ?? null
        };
        return validData;
    }
};
