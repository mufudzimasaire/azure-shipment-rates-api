import { inject, injectable } from 'inversify'
import { IShipmentRepository } from '../../repositories/shipment-repository'
import { IFetchRatesPayload, IRate } from '../../interfaces'
import { TYPES } from '../../types'
import ShipEngine from 'shipengine'
import { warehouseAddress } from './warehouse-address'

/**
 * @interface IShipmentService
 * @desc Responsible for fetching rates.
 **/
export interface IShipmentService {
  fetchRates: (payload: IFetchRatesPayload) => Promise<IRate[] | null>
}

@injectable()
export class ShipmentService implements IShipmentService {
  private _repository: IShipmentRepository;
  private _shipengine: ShipEngine;

  /**
   * Initializes the ShipmentService class with the provided repository and ShipEngine instance.
   * @param repository - The repository used to save the fetched shipment rates.
   * @param shipengine - The ShipEngine instance used to fetch shipment rates.
   */
  constructor(
    @inject(TYPES.ShipmentRepository) repository: IShipmentRepository,
    @inject(TYPES.ShipEngine) shipengine: ShipEngine
  ) {
    this._repository = repository;
    this._shipengine = shipengine;
  }

  /**
   * Fetches shipment rates using the ShipEngine API based on the provided payload.
   * It validates the shipping address, calculates rates, transforms the rates into a standardized format, and saves the rates to the repository.
   * @param payload - The payload containing the necessary information for fetching rates.
   * @returns The fetched rates or null if there was an error.
   * @throws Error if there was an error getting shipment rates.
   */
  async fetchRates(payload: IFetchRatesPayload): Promise<IRate[] | null> {
    try {
      const result = await this._shipengine.getRatesWithShipmentDetails({
        rateOptions: {
          carrierIds: process.env.SHIPENGINE_CARRIER_IDS.split(',')
        },
        shipment: {
          validateAddress: 'no_validation',
          shipTo: {
            companyName: payload?.shippingAddress?.companyName || '',
            name: payload?.shippingAddress?.name || '',
            phone: payload?.shippingAddress?.phoneNumber || '',
            addressLine1: payload?.shippingAddress?.addressLine1 || '',
            cityLocality: payload?.shippingAddress?.city || '',
            stateProvince: payload?.shippingAddress?.state || '',
            postalCode: payload?.shippingAddress?.postcode || '',
            countryCode: payload?.shippingAddress?.country || '',
            addressResidentialIndicator: payload?.shippingAddress?.companyName ? 'no' : 'yes',
          },
          shipFrom: {
            ...warehouseAddress,
            addressResidentialIndicator: 'no',
          },
          packages: [
            { weight: payload?.weight },
          ],
        },
      });

      if (!result) return null;

      const errorMessage = result?.rateResponse?.errors?.[0]?.message;

      if (errorMessage) throw new Error(errorMessage);

      const rates = result?.rateResponse?.rates.map(this._transformRate);

      await this._repository.createShipment({
        id: result?.shipmentId,
        rates,
        shippingAddress: payload?.shippingAddress,
        weight: result?.totalWeight
      });

      return rates;
    } catch (error) {
      throw new Error(`Error getting shipment rates: ${error.message}`);
    }
  }

  /**
   * Transforms a single rate object returned into a standardised format.
   * @param rate - The rate object to transform.
   * @returns The transformed rate object in a standardized format.
   */
  private _transformRate(rate: any): IRate {
    return {
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
      trackable: rate?.trackable
    };
  }
}
