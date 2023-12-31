import { inject, injectable } from 'inversify';

import { IFetchRatesPayload, IShipment } from '../../interfaces';
import { IShipmentAdapter } from './adapters/shipengine-adapter';
import { IShipmentRepository } from '../../repositories/shipment-repository';
import { ShipmentError } from './errors/shipment-error';
import { ShipmentRatesError } from './errors/shipment-rates-error';
import { TYPES } from '../../types';

/**
 * @interface IShipmentService
 * @desc Responsible for fetching rates.
 **/
export interface IShipmentService {
  fetchRates: (payload: IFetchRatesPayload) => Promise<IShipment | null>
  findShipment: (id: IShipment['id']) => Promise<IShipment | null>
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
  async fetchRates(payload: IFetchRatesPayload): Promise<IShipment | null> {
    try {
      const shipment: IShipment = await this._client.fetchRates(payload);

      if (!shipment) {
        return shipment;
      }

      await this._repository.createShipment(shipment);

      return shipment;
    } catch (error) {
      throw new ShipmentRatesError(`Error getting shipment rates: ${error.message}`);
    }
  }
  
  /**
   * Finds a shipment by its ID in the repository.
   * @param id - The ID of the shipment to find.
   * @returns The found shipment or null if it doesn't exist.
   * @throws {ShipmentError} if there was an error getting the shipment.
   */
  async findShipment(id: IShipment['id']): Promise<IShipment | null> {
    try {
      const shipment = await this._repository.findShipment(id);
      return shipment;
    } catch (error) {
      throw new ShipmentError(`Error getting shipment: ${error.message}`);
    }
  }
}
