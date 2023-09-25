import { inject, injectable } from 'inversify'
import { IShipment } from '../../interfaces';
import { CosmosClient, Container as CosmosContainer, ItemDefinition } from '@azure/cosmos';
import { TYPES } from '../../types';
import { DatabaseConflictError } from '../../errors/database-conflict-error';

/**
 * @interface IShipmentRepository
 * @desc Responsible for persisting shipment rates.
 **/
export interface IShipmentRepository {
  createShipment: (shipment: IShipment) => Promise<void>
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
   * @throws {DatabaseConflictError} - If there is a conflict with an existing shipment.
   */
  async createShipment(shipment: IShipment): Promise<void> {
    try {
      await this._container.items.create(shipment);
    } catch (error) {
      // propagate error
      throw new DatabaseConflictError(error.message);
    }
  }
}
