import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import appContainer from '../src/inversify.config'
import { IShipmentService } from '../src/services/shipment-service'
import { TYPES } from '../src/types'

const fetchRatesTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const shipmentService = appContainer.get<IShipmentService>(TYPES.ShipmentService)
    const result = await shipmentService.fetchRates(req.body)

    context.res = {
      body: result
    }
  } catch(error) {
    context.log.error(`FetchRates: An error occured -  ${error.message}`)
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

export default fetchRatesTrigger