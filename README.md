# BASE-API

A basic RESTful API built with **Node.js**, **Express**, and **TypeScript**.

![JWT Auth Enabled](https://img.shields.io/badge/auth-JWT-green)

## Basic routes setup :

-   **Main routes**: Only here to perform a quick healthcheck. Route
    'healthcheck/details' is protected fro demonstration purpose and requires an
    access token.Copy and use them as a starting point.
-   **Auth routes**: Exposed through a separate authentication server
    (`authServer.ts`). Includes login/signup logic, validation(minimal
    middleware, improve it with a library of your choice, e.g. zod, joi, etc),
    password hashing, and JWT-based authentication with access and refresh
    tokens.
-   **Book routes**: Serve as an example of standard CRUD operations backed by
    MongoDB using generic middlewares. Can be used as a template to define other
    resource routes in a modular way.

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
SERVER_PORT=3000
SERVER_HOSTNAME=localhost
AUTH_PORT=4000
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
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
