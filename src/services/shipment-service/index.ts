import { inject, injectable } from 'inversify'
import { IShipmentRepository } from '../../repositories/shipment-repository'
import { IFetchRatesPayload, IRate, IShipment } from '../../interfaces'
import { TYPES } from '../../types'
import { IShipmentAdapter } from './adapters/shipengine-adapter'
import { ShipmentRatesError } from './errors/shipment-rates-error'

/**
 * @interface IShipmentService
 * @desc Responsible for fetching rates.
 **/
export interface IShipmentService {
  fetchRates: (payload: IFetchRatesPayload) => Promise<IRate[]>
}

@injectable()
export class ShipmentService implements IShipmentService {
  private _repository: IShipmentRepository;
  private _client: IShipmentAdapter;

  /**
   * Initializes the ShipmentService class with the provided repository and ShipEngine instance.
   * @param repository - The repository used to save the fetched shipment rates.
   * @param client - The client used to fetch shipment rates.
   */
  constructor(
    @inject(TYPES.ShipmentRepository) repository: IShipmentRepository,
    @inject(TYPES.ShipEngineAdapter) client: IShipmentAdapter
  ) {
    this._repository = repository;
    this._client = client;
  }

  /**
   * Fetches shipment rates and saves the rates to the repository.
   * @param payload - The payload containing the necessary information for fetching rates.
   * @returns The fetched rates or null if there was an error.
   * @throws {ShipmentRatesError} if there was an error getting shipment rates.
   */
  async fetchRates(payload: IFetchRatesPayload): Promise<IRate[]> {
    try {
      const shipment: IShipment = await this._client.fetchRates(payload);

      if (!shipment) return [];

      await this._repository.createShipment(shipment);

      return shipment?.rates;
    } catch (error) {
      throw new ShipmentRatesError(`Error getting shipment rates: ${error.message}`);
    }
  }
}
