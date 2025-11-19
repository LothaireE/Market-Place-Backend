export type AuthorizedUser = { // payload of JWT token
    userId: string;
    username: string;
    source: string;
    iat: number;
    exp: number;
};

export type JWTPayload = {
    subject: string;
    username: string;
    source?: 'login' | 'refresh' | 'test';
    iat: number;
    exp: number;
};

export type UserType = { // should replace with generated User from ORM
    id: string;
    username: string;
    email: string;
    password: string;
    avatarUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateUserType = Omit<
    UserType,
    'id' | 'createdAt' | 'updatedAt'
>;

// export type CreateUserType = {
//     username: string;
//     email: string;
//     password: string;
//     avatarUrl?: string | null;
// };
