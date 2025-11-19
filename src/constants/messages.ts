export const ERROR_MESSAGES = {
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        INVALID_USERNAME: 'Invalid or missing username',
        INVALID_EMAIL: 'Invalid or missing email',
        INVALID_PASSWORD: 'Invalid or missing password',
        INVALID_CONFIRM_PASSWORD: 'Invalid or missing confirm password',

        EMAIL_ALREADY_EXISTS: 'Email already registered',
        UNAUTHORIZED: 'You must be logged in to perform this action',
        FORBIDDEN: 'You do not have permission to access this resource',
        INVALID_TOKEN: 'Invalid or expired token',
        REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
        REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found or already used',
        MISSING_HEADER: 'Authorization header is missing',
        ACCESS_TOKEN_REQUIRED: 'Access token is required'
    },
    USER: {
        NOT_FOUND: 'User not found',
        USERNAME_TAKEN: 'Username is already taken'
    },
    SELLER: {
        NOT_FOUND: 'Seller Profile not found',
        ALREADY_EXISTS: 'Seller Profile already exists for this user'
    },
    PRODUCT: {
        NOT_FOUND: 'Product not found',
        UNAUTHORIZED: 'You are not authorized to perform this action',
        IMAGES_DESTROY_FAILED: 'Something went wrong during images destroy operation.',
        ALREADY_EXIST: 'Product already exist'
    },
    VALIDATION: {
        MISSING_FIELDS: 'Required fields are missing',
        INVALID_EMAIL: 'Email is not valid',
        PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long'
    },
    COMMON: {
        INTERNAL_ERROR: 'Internal server error'
    }
};

export const SUCCESS_MESSAGES = {
    AUTH: {
        SIGNUP_SUCCESS: 'User signed up successfully',
        LOGIN_SUCCESS: 'User logged in successfully',
        LOGOUT_SUCCESS: 'User logged out successfully',
        TOKEN_REFRESHED: 'Access token refreshed successfully'
    },
    USER: {
        CREATED: 'User created successfully',
        UPDATED: 'User updated successfully',
        DELETED: 'User deleted successfully'
    },
    PRODUCT: {
        CREATED: 'Product created successfully',
        UPDATED: 'Product updated successfully',
        DELETED: 'Product deleted successfully'
    },
    COMMON: {
        ACTION_SUCCESS: 'Action completed successfully'
    }
};
