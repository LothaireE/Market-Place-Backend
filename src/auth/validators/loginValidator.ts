/**
 * This is a basic Schema for validating login data. I can replace it with any other validation library at any given point.
 *
 * @remarks
 * Provides an asynchronous `validateAsync` method to validate
 *
 * @property validateAsync - Asynchronously validates the provided data object.
 * Throws an error with a `details` property containing validation messages if validation fails.
 */

type loginData = {
    email: string;
    password: string;
};

export const loginValidator = {
    async validateAsync(data: loginData) {
        const errors: string[] = [];

        if (
            !data.email ||
            typeof data.email !== 'string' ||
            !data.email.includes('@')
        ) {
            errors.push('Invalid or missing email.');
        }

        if (
            !data.password ||
            typeof data.password !== 'string' ||
            data.password.length < 6
        ) {
            errors.push('Invalid or missing password.');
        }

        if (errors.length > 0) {
            const error = new Error('Validation failed');
            (error as any).details = errors;
            throw error;
        }

        const validData = {
            email: data.email.trim(),
            password: data.password
        };

        return validData;
    }
};
