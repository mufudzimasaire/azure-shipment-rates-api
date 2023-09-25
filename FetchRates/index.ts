import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import appContainer from '../src/inversify.config'
import { IShipmentService } from '../src/services/shipment-service'
import { TYPES } from '../src/types'
import { handleResponse } from '../src/lib/handle-response'
import { IFetchRatesPayload } from '../src/interfaces'

const fetchRatesTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const payload: IFetchRatesPayload = req.body

    if (!payload) {
      return handleResponse(context, 400, 'Invalid payload provided');
    }

    const shipmentService = appContainer.get<IShipmentService>(TYPES.ShipmentService)
    const result = await shipmentService.fetchRates(payload)

    return handleResponse(context, 200, result);
  } catch(error) {
    return handleResponse(context, 500, error.message);
  }
}

export default fetchRatesTrigger