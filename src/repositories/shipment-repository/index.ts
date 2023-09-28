import { CosmosClient, Container as CosmosContainer } from '@azure/cosmos';
import { inject, injectable } from 'inversify';

import { IShipment } from '../../interfaces';
import { TYPES } from '../../types';
import { NotFoundError } from './errors/not-found-error';
import { ResourceConflictError } from './errors/resource-conflict-error';

/**
 * @interface IShipmentRepository
 * @desc Responsible for persisting shipment rates.
 **/
export interface IShipmentRepository {
  createShipment: (shipment: IShipment) => Promise<void>
  findShipment(id: IShipment['id']): Promise<IShipment | null>
}

@injectable()
export class ShipmentRepository implements IShipmentRepository {
  private _container: CosmosContainer;

  /**
   * Initializes a new instance of the ShipmentRepository class.
   * @param cosmosClient - The CosmosClient instance used to connect to the Cosmos DB container.
   */
  constructor(@inject(TYPES.CosmosClient) cosmosClient: CosmosClient) {
    this._container = cosmosClient.database(process.env.DATABASE_NAME)
      .container(process.env.DATABASE_CONTAINER);
  }

  /**
   * Creates a shipment in the Cosmos DB container.
   * @param shipment - The shipment object to be created.
   * @throws {ResourceConflictError} - If there is a conflict with an existing shipment.
   */
  async createShipment(shipment: IShipment): Promise<void> {
    try {
      await this._container.items.create(shipment);
    } catch (error) {
      throw new ResourceConflictError(error.message);
    }
  }

  /**
   * Retrieves a shipment object from the Cosmos DB container based on its ID.
   * If the shipment is found, it returns the shipment object.
   * If the shipment is not found, it throws a NotFoundError with an error message.
   * 
   * @param id - The ID of the shipment to find in the Cosmos DB container.
   * @returns A promise that resolves to the found shipment object (IShipment) if the shipment is found, or null if the shipment is not found.
   * @throws NotFoundError if the shipment is not found.
   */
  async findShipment(id: IShipment['id']): Promise<IShipment | null> {
    try {
      const { resource } = await this._container.item(id, id).read();
      return resource;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  }
}
