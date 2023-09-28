import 'reflect-metadata';
import { BindingScopeEnum, Container } from 'inversify';
import ShipEngine from 'shipengine';


import { CosmosClient } from '@azure/cosmos';
import { IShipmentAdapter, ShipEngineAdapter } from './services/shipment-service/adapters/shipengine-adapter';
import { IShipmentRepository, ShipmentRepository } from './repositories/shipment-repository';
import { IShipmentService, ShipmentService } from './services/shipment-service';
import { TYPES } from './types';

const appContainer = new Container({
  /**
   * Ensure classes are assembled once during the execution
   * of a single function, unless specified at a class level.
   */
  defaultScope: BindingScopeEnum.Request
})

appContainer.bind<CosmosClient>(TYPES.CosmosClient).toConstantValue(
  new CosmosClient({
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY
  })
)

appContainer.bind<ShipEngine>(TYPES.ShipEngine).toConstantValue(
  new ShipEngine(process.env.SHIPENGINE_API_KEY)
)

appContainer.bind<IShipmentRepository>(TYPES.ShipmentRepository).to(ShipmentRepository)
appContainer.bind<IShipmentService>(TYPES.ShipmentService).to(ShipmentService)
appContainer.bind<IShipmentAdapter>(TYPES.ShipEngineAdapter).to(ShipEngineAdapter)

export default appContainer
