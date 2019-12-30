import { sign } from 'jsonwebtoken';
import { TokenData } from '../interfaces';
import { User } from '../user/user';

export const createUserSessionCookie = (user: User): string => {
  const { token, expiresIn } = createToken(user);
  return `Authorization=${token}; HttpOnly; Max-Age=${expiresIn}`;
};

export const createToken = (user: User): TokenData => {
  const expiresIn = 60 * 60; // an hour
  const secret = process.env.JWT_SECRET;
  return {
    expiresIn,
    token: sign({ _id: user.id }, secret, { expiresIn }),
  };
};
