import 'reflect-metadata'
import { BindingScopeEnum, Container } from 'inversify'
import { CosmosClient } from '@azure/cosmos'
import { TYPES } from './types'

const container = new Container({
  /**
   * Auto-bind classes marked with the annotation @injectible
   * Helps prevent manually binding of every class.
   */
  autoBindInjectable: true,
  /**
   * Ensure classes are assembled once during the execution
   * of a single function, unless specified at a class level.
   */
  defaultScope: BindingScopeEnum.Request
})

container.bind<CosmosClient>(TYPES.CosmosClient).toConstantValue(
  new CosmosClient({
    endpoint: process.env.COSMOSDB_ENDPOINT,
    key: process.env.COSMOSDB_KEY
  })
);

export default container
