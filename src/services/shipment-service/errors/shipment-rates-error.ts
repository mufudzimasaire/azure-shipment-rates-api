/**
 * @class ShipmentRatesError
 * @desc Custom error class for errors related to shipment rates.
 */
export class ShipmentRatesError extends Error {
  /**
   * Creates a new instance of ShipmentRatesError.
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'ShipmentRatesError';
  }
}
