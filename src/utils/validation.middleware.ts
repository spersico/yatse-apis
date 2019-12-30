import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import Exception from '../exceptions/Exception';

function extractErrorMessages(validationErrors: ValidationError[]) {
  return validationErrors.map((error: ValidationError) => {
    return !error.constraints && error.children ? extractErrorMessages(error.children) : Object.values(error.constraints);
  });
}

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
  return (req, _, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = extractErrorMessages(errors).join(', ');
          next(new Exception(400, message));
        } else {
          next();
        }
      });
  };
}

export default validationMiddleware;
