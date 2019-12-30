export default class Exception extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status || 500;
    this.message = message || 'Ups, something broke';
  }
}
