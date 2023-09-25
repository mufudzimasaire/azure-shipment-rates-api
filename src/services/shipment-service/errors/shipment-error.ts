/**
 * @class ShipmentError
 * @desc Represents errors that occur specifically in the context of shipping operations.
 */
export class ShipmentError extends Error {
  /**
   * Creates a new instance of the ShipmentError class.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'ShipmentError';
  }
}
