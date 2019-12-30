import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { NoTokenException, WrongTokenException } from '../exceptions/AuthExceptions';

import { AuthenticatedRequest, DataStoredInToken } from '../interfaces';
import { userModel } from '../user/user';

async function authMiddleware(request: Request, _: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    try {
      const { _id } = verify(cookies.Authorization, process.env.JWT_SECRET) as DataStoredInToken;
      if (await userModel.exists({ _id })) {
        (request as AuthenticatedRequest).userId = _id;
        next();
      } else {
        next(new WrongTokenException());
      }
    } catch (error) {
      next(new WrongTokenException());
    }
  } else {
    next(new NoTokenException());
  }
}

export default authMiddleware;
