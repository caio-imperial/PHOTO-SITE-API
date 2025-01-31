export class InvalidInputException extends Error {
  constructor(message?: string) {
    super(message || 'Invalid input');
  }
}
