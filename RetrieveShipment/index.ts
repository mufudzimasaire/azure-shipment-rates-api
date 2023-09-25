import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { IShipment } from "../src/interfaces";
import appContainer from "../src/inversify.config";
import { IShipmentService } from '../src/services/shipment-service'
import { TYPES } from '../src/types'

const retrieveShipmentTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const shipmentId = req.params?.id

    if (!shipmentId) {
      context.res = {
        status: 400,
        body: `Invalid shipment id: ${shipmentId} provided`
      };
      return;
    }

    const shipmentService = appContainer.get<IShipmentService>(TYPES.ShipmentService);
    const shipment: IShipment = await shipmentService.findShipment(shipmentId);

    if (!shipment) {
      context.res = {
        status: 404,
        body: `Shipment with id: ${shipmentId} - not found.`
      };
      return;
    }

    context.res = {
      body: shipment
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error?.message
    }
  }
};

export default retrieveShipmentTrigger;
