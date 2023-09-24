import { inject, injectable } from 'inversify'
import { IShipment } from '../interfaces';
import { CosmosClient } from '@azure/cosmos';
import { TYPES } from '../types';

/**
 * @interface IShipmentRepository
 * @desc Responsible for persisting shipment rates.
 **/
export interface IShipmentRepository {
  createShipment: (shipment: IShipment) => Promise<void>
}

@injectable()
export class ShipmentRepository implements IShipmentRepository {
  private _db: CosmosClient

  constructor(@inject(TYPES.CosmosClient) cosmosClient: CosmosClient) {
    this._db = cosmosClient.database(process.env.DATABASE_NAME)
                            .container(process.env.DATABASE_CONTAINER_NAME)
  }

  async createShipment(shipment: IShipment): Promise<void> {
    console.log('ShipmentRepository.createShipment', {shipment})
  }
}