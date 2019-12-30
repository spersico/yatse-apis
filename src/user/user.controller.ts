import { hash } from 'bcrypt';
import { UnauthorizedException } from '../exceptions/AuthExceptions';

import { NextFunction, Request, Response, Router } from 'express';

import authMiddleware from '../auth/auth.middleware';
import { AuthenticatedRequest, Controller } from '../interfaces';
import { postModel } from '../post/post';
import { UserDTO, userModel } from '../user/user';

import { UserWithPreExistantEmailException } from '../exceptions/UserExceptions';
import { createUserSessionCookie } from '../utils/jwtCookie';
import { defaultModifier, userModifier } from '../utils/mongooseToJsonModifier';
import validationMiddleware from '../utils/validation.middleware';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(UserDTO), this.register);
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  /** Registers a new user, and returns the created user, together with a cookie so that the user has access to the API  */
  private register = async (request: Request, response: Response, next: NextFunction) => {
    const userData: UserDTO = request.body;
    try {
      if (await this.user.exists({ email: userData.email })) {
        throw new UserWithPreExistantEmailException(userData.email);
      }
      userData.password = await hash(userData.password, 10);
      const createdUser = (await this.user.create(userData)).toJSON(userModifier);
      response.setHeader('Set-Cookie', [createUserSessionCookie(createdUser)]);
      response.send(createdUser);
    } catch (error) {
      next(error);
    }
  }

  private getAllPostsOfUser = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    if (request.params.id === request.userId) {
      const posts = await this.post.find({ author: request.params.id });
      response.send(posts.map(post => post.toJSON(defaultModifier)));
    } else {
      next(new UnauthorizedException());
    }
  }
}

export default UserController;
