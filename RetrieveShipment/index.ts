import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { handleResponse } from '../src/lib/handle-response';
import { IShipment } from '../src/interfaces';
import { IShipmentService } from '../src/services/shipment-service';
import { TYPES } from '../src/types';
import appContainer from '../src/inversify.config';

const retrieveShipmentTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const shipmentId: IShipment['id'] = req.params?.id

    if (!shipmentId) {
      return handleResponse(context, 400, `Invalid shipment id: ${shipmentId} provided`);
    }

    const shipmentService = appContainer.get<IShipmentService>(TYPES.ShipmentService);
    const shipment: IShipment = await shipmentService.findShipment(shipmentId);

    if (!shipment) {
      return handleResponse(context, 404, `Shipment with id: ${shipmentId} - not found.`);
    }

    return handleResponse(context, 200, shipment);
  } catch (error) {
    return handleResponse(context, 500, error?.message)
  }
};

export default retrieveShipmentTrigger;
