import { Request, Router } from 'express';

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  _id: string;
}

export interface Controller {
  path: string;
  router: Router;
}

export interface AuthenticatedRequest extends Request {
  userId: string;
}
