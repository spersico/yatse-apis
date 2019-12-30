import validationMiddleware from '../utils/validation.middleware';

import { WrongCredentialsException } from '../exceptions/AuthExceptions';

import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from '../interfaces';
import { userModel } from '../user/user';
import { createUserSessionCookie, validatePassword } from '../utils/jwtCookie';
import { defaultModifier } from '../utils/mongooseToJsonModifier';
import LoginDTO from './logIn';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDTO), this.login);
    this.router.delete(`${this.path}/logout`, this.logout);
  }

  /** Logins the user, and returns the logged in user, and sets the cookie with the jwt token  */
  private login = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const logInData: LoginDTO = request.body;
      const userFound = (await this.user.findOne({ email: logInData.email })).toJSON(defaultModifier);
      if (userFound) {
        const isPasswordMatching = await validatePassword(logInData.password, userFound.password, userFound.salt);
        if (isPasswordMatching) {
          response.setHeader('Set-Cookie', [createUserSessionCookie(userFound)]);
          response.send({ ...userFound, password: undefined, salt: undefined });
        } else {
          next(new WrongCredentialsException());
        }
      } else {
        next(new WrongCredentialsException());
      }
    } catch (error) {
      next(error);
    }
  }

  private logout = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.sendStatus(200);
  }
}

export default AuthenticationController;
