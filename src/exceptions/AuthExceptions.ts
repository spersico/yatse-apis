// tslint:disable: max-classes-per-file
import Exception from './Exception';

export class WrongCredentialsException extends Exception {
  constructor() {
    super(401, 'Wrong credentials');
  }
}

export class WrongTokenException extends Exception {
  constructor() {
    super(401, 'Wrong authentication token');
  }
}

export class UnauthorizedException extends Exception {
  constructor() {
    super(403, "You're not authorized");
  }
}

export class NoTokenException extends Exception {
  constructor() {
    super(401, 'Authentication token missing');
  }
}
