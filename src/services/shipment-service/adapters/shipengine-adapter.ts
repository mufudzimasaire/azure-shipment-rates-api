import { inject, injectable } from 'inversify';
import ShipEngine from 'shipengine';

import { IFetchRatesPayload, IShipment } from '../../../interfaces';
import { TYPES } from '../../../types';
import { ShipmentRatesError } from '../errors/shipment-rates-error';
import { warehouseAddress } from '../warehouse-address';

/**
 * @interface IShipmentAdapter
 * @desc Responsible for fetching rates from ShipEngine API.
 **/
export interface IShipmentAdapter {
  fetchRates: (payload: IFetchRatesPayload) => Promise<IShipment>
}

@injectable()
export class ShipEngineAdapter implements IShipmentAdapter {
  private shipEngine: ShipEngine;

  /**
   * Initializes the ShipEngineAdapter class with a ShipEngine instance.
   * @param shipengine - The ShipEngine instance used for making API calls.
   */
  constructor(@inject(TYPES.ShipEngine) shipengine: ShipEngine) {
    this.shipEngine = shipengine;
  }

  /**
   * Retrieves shipment rates using the ShipEngine API.
   * @param payload - The payload object containing the shipping address and weight of the shipment.
   * @returns A promise that resolves to an IShipment object if no rates are found.
   * @throws {ShipmentRatesError} - If there is an error in retrieving the rates.
   */
  async fetchRates(payload: IFetchRatesPayload): Promise<IShipment> {
    const { shippingAddress, weight } = payload;
    const { companyName, name, phoneNumber, addressLine1, city, state, postcode, country } = shippingAddress;

    const result = await this.shipEngine.getRatesWithShipmentDetails({
      rateOptions: {
        carrierIds: process.env.SHIPENGINE_CARRIER_IDS?.split(','),
      },
      shipment: {
        validateAddress: 'no_validation',
        shipTo: {
          companyName: companyName || '',
          name: name || '',
          phone: phoneNumber || '',
          addressLine1: addressLine1 || '',
          cityLocality: city || '',
          stateProvince: state || '',
          postalCode: postcode || '',
          countryCode: country || '',
          addressResidentialIndicator: companyName ? 'no' : 'yes',
        },
        shipFrom: {
          ...warehouseAddress,
          addressResidentialIndicator: 'no',
        },
        packages: [{ weight }],
      },
    });

    const errorMessage = result?.rateResponse?.errors?.[0]?.message;

    if (errorMessage) throw new ShipmentRatesError(errorMessage);

    return {
      id: result?.shipmentId,
      rates: result?.rateResponse?.rates.map((rate) => ({
        id: rate?.rateId,
        carrier: rate?.serviceType,
        carrierCode: rate?.carrierCode,
        carrierId: rate?.carrierId,
        confirmationAmount: rate?.confirmationAmount?.amount,
        currency: rate?.shippingAmount?.currency,
        deliveryDays: rate?.deliveryDays,
        estimatedDeliveryDate: rate?.estimatedDeliveryDate,
        insuranceAmount: rate?.insuranceAmount?.amount,
        serviceCode: rate?.serviceCode,
        shipDate: rate?.shipDate,
        shipmentAmount: rate?.shippingAmount?.amount,
        trackable: rate?.trackable,
      })),
      shippingAddress: payload?.shippingAddress,
      weight: payload?.weight,
    };
  }
}
