import Exception from './Exception';

export class UserWithPreExistantEmailException extends Exception {
  constructor(email: string) {
    super(400, `User with email ${email} already exists`);
  }
}
