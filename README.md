# BASE-API

A basic RESTful API built with **Node.js**, **Express**, and **TypeScript**.

![JWT Auth Enabled](https://img.shields.io/badge/auth-JWT-green)

## Basic routes setup :

-   **Main routes**: Here to manage Product creation and deletion as it is recommended to avoid uploading files through GraphQL entirely. Route
    are protected and requires an
    access token.
-   **Auth routes**: Exposed through a separate authentication server
    (`authServer.ts`). Includes login/signup logic, validation(minimal
    middleware, improve it with a library of your choice, e.g. zod, joi, etc),
    password hashing, and JWT-based authentication with access and refresh
    tokens.
    

## Features

-   Modular project structure using TypeScript
-   Custom logging middleware
-   `.env` file support for configuration
-   Separation between main API and authentication logic
-   JWT-based authentication (access & refresh tokens)
-   Secure password hashing with bcrypt
-   Test coverage reports using Jest
-   Development workflow with `nodemon` / `ts-node-dev`

## Installation

```bash
git clone https://github.com/LothaireE/BASE-API.git
cd BASE-API
npm install
npm install -g nodemon ts-node typescript
```

## Usage

### Launch servers in development:

Start the **main application** (API with resources):

```bash
npm run dev
```

Start the **auth application** (login/signup/token endpoints):

```bash
npm run devAuth
```

Or both using concurrently library:

```bash
npm run dev:all
```

### Build and run in production:

```bash
npm run build
npm start
```

## Test Coverage Report

```bash
npm run test
```

View the report:

`/coverage/lcov-report/index.html`

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env

# Postgres
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_PORT=

DATABASE_URL=

#Server
SERVER_PORT=8000
SERVER_HOSTNAME=localhost

# Auth Server
AUTH_SERVER_PORT=8100
AUTH_SERVER_HOSTNAME=localhost

# JWT
JWT_SECRET=
JWT_EXPIRATION=1h
REFRESH_TOKEN_SECRET=

# CLOUDINARY
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=
```

## JWT Authentication

Auth is handled via a dedicated server. Users get access & refresh tokens.  
Access to protected routes requires a valid access token.

![JWT Auth Flow](./jwt_auth_flow.png)

## Controllers

Logic is grouped into controller classes, e.g.:

```ts
class HealthController {
    static healthCheck(req: Request, res: Response) {
        res.status(200).json({ message: 'API is running' });
    }
}
```
