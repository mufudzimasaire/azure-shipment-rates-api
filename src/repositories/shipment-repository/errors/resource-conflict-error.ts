/**
 * @class ResourceConflictError
 * @desc Represents an error that occurs when there is a conflict with a resource while creating a resource.
 */
export class ResourceConflictError extends Error {
  /**
   * Constructs a new NotFoundError instance.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'ResourceConflictError';
  }
}

