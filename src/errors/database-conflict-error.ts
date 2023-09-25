export class DatabaseConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConflictError';
  }
}
