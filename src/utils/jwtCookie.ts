import { randomBytes, scrypt } from 'crypto';
import { sign } from 'jsonwebtoken';
import { TokenData } from '../interfaces';
import { User } from '../user/user';

export const hashPassword = (password: string): Promise<{ passwordSalt: string, passwordHash: string }> => {
  const passwordSalt = randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    scrypt(password, process.env.SALT + passwordSalt, 150, (err, hash) => {
      if (err) { reject(err); } else { resolve({ passwordSalt, passwordHash: hash.toString('hex') }); }
    });
  });
};

export const validatePassword = (passwordToValidate: string, passwordHash: string, passwordSalt: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    scrypt(passwordToValidate, process.env.SALT + passwordSalt, 150, (err, derivedKey) => {
      if (err) { reject(err); } else { resolve(derivedKey.toString('hex') === passwordHash); }
    });
  });
};

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
