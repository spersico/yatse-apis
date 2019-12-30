import { NextFunction, Request, Response } from 'express';
import Exception from '../exceptions/Exception';

export default function exceptionMiddleware(error: Exception, _: Request, response: Response, __: NextFunction) {
  response.status(error.status).send({ message: error.message, status: error.status });
}
