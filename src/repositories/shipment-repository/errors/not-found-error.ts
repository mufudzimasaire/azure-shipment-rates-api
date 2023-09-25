/**
 * @class NotFoundError
 * @desc Represents an error when a resource is not found.
 */
export class NotFoundError extends Error {
  /**
   * Constructs a new NotFoundError instance.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
