import { NextFunction, Request, Response } from 'express';

function loggerMiddleware(request: Request, _: Response, next: NextFunction) {
  // tslint:disable-next-line: max-line-length
  console.log(`${new Date().toLocaleDateString()} - ${new Date().toTimeString().slice(0, 8)} || ${request.method} ${request.path}`);
  next();
}

export default loggerMiddleware;
