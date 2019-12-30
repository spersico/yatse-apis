import Exception from './Exception';

export class PostNotFoundException extends Exception {
  constructor(id: string) {
    super(404, `Post with id ${id} not found`);
  }
}
