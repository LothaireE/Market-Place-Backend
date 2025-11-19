import { Router } from 'express';
import AuthController from '../controller/auth.controller';
import { loginValidator } from '../auth/validators/loginValidator';
import { signupValidator } from '../auth/validators/signupValidator';
import { validate } from '../middlewares/validate';

const authRouter = Router();

authRouter.post('/login', validate(loginValidator), AuthController.login);
authRouter.post('/signup', validate(signupValidator), AuthController.signup);
authRouter.post('/refresh-token', AuthController.refreshToken);
authRouter.post('/logout', AuthController.logout);

export default authRouter;
