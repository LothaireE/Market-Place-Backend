import { Router } from 'express';
import AuthController from '../controller/auth.controller';
import { loginValidator } from '../auth/validators/loginValidator';
import { signupValidator } from '../auth/validators/signupValidator';
import { validate } from '../middlewares/validate';

const authRouter = Router();

// POST
authRouter.post('/auth/login', validate(loginValidator), AuthController.login);
authRouter.post('/auth/signup', validate(signupValidator), AuthController.signup);
authRouter.post('/auth/refresh', AuthController.refreshToken);
authRouter.post('/auth/logout', AuthController.logout);

export default authRouter;
