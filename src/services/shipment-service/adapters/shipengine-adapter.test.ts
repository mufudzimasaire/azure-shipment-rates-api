import { ShipEngineAdapter } from "./shipengine-adapter";
import { warehouseAddress } from '../warehouse-address'
import { IFetchRatesPayload } from "../../../interfaces";

function shipEngineMockClient(rateResponse = {}) {
  return {
    getRatesWithShipmentDetails: jest.fn().mockResolvedValue(rateResponse),
    config: { apiKey: '123' },
    validateAddresses: jest.fn(),
    listCarriers: jest.fn(),
    trackUsingCarrierCodeAndTrackingNumber: jest.fn(),
    trackUsingLabelId: jest.fn(),
    createLabelFromShipmentDetails: jest.fn(),
    createLabelFromRate: jest.fn(),
    voidLabelWithLabelId: jest.fn()
  }
}

function mockRatesPayload(): IFetchRatesPayload {
  return {
    shippingAddress: {
      companyName: 'Example Corp.',
      name: 'John Doe',
      phoneNumber: '111-111-1111',
      addressLine1: '123 Main St',
      city: 'Austin',
      state: 'TX',
      postcode: '78731',
      country: 'US',
    },
    weight: {
      value: 10,
      unit: 'kilogram',
    },
  }
}

describe('ShipEngineAdapter', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { SHIPENGINE_CARRIER_IDS: 'test-1234' }
  })

  afterEach(() => {
    process.env = env
  })
  
  it('should retrieve shipment rates with valid payload and ShipEngine instance', async () => {
    // Arrange
    const shipEngineMock = shipEngineMockClient({
      rateResponse: {
        rates: [
          {
            rateId: 'rate1',
            serviceType: 'Standard',
            carrierCode: 'UPS',
            carrierId: 'ups',
            confirmationAmount: {
              amount: 10,
            },
            shippingAmount: {
              currency: 'USD',
              amount: 20,
            },
            deliveryDays: 3,
            estimatedDeliveryDate: '2022-01-01',
            insuranceAmount: {
              amount: 5,
            },
            serviceCode: 'ST',
            shipDate: '2021-12-31',
            trackable: true,
          },
        ],
      },
      totalWeight: {
        value: 10,
        unit: 'kilogram',
      },
      shipmentId: 'shipment1',
    });
    const adapter = new ShipEngineAdapter(shipEngineMock);
    const payload: IFetchRatesPayload = mockRatesPayload();

    // Act
    const result = await adapter.fetchRates(payload);

    // Assert
    expect(result).toEqual({
      id: 'shipment1',
      rates: [
        {
          id: 'rate1',
          carrier: 'Standard',
          carrierCode: 'UPS',
          carrierId: 'ups',
          confirmationAmount: 10,
          currency: 'USD',
          deliveryDays: 3,
          estimatedDeliveryDate: '2022-01-01',
          insuranceAmount: 5,
          serviceCode: 'ST',
          shipDate: '2021-12-31',
          shipmentAmount: 20,
          trackable: true,
        },
      ],
      shippingAddress: payload.shippingAddress,
      weight: {
        value: 10,
        unit: 'kilogram',
      },
    });

    expect(shipEngineMock.getRatesWithShipmentDetails).toHaveBeenCalledWith({
      rateOptions: {
        carrierIds: process.env.SHIPENGINE_CARRIER_IDS.split(','),
      },
      shipment: {
        validateAddress: 'no_validation',
        shipTo: {
          companyName: payload.shippingAddress.companyName || '',
          name: payload.shippingAddress.name || '',
          phone: payload.shippingAddress.phoneNumber || '',
          addressLine1: payload.shippingAddress.addressLine1 || '',
          cityLocality: payload.shippingAddress.city || '',
          stateProvince: payload.shippingAddress.state || '',
          postalCode: payload.shippingAddress.postcode || '',
          countryCode: payload.shippingAddress.country || '',
          addressResidentialIndicator: payload.shippingAddress.companyName ? 'no' : 'yes',
        },
        shipFrom: {
          ...warehouseAddress,
          addressResidentialIndicator: 'no',
        },
        packages: [{ weight: payload.weight }],
      },
    });
  });

  it('should return shipment with empty rates array when no rates are found', async () => {
    // Arrange
    const shipEngineMock = shipEngineMockClient({
      rateResponse: {
        rates: [],
      },
      totalWeight: {
        value: 10,
        unit: 'kilogram',
      },
      shipmentId: 'shipment1',
    });
    const adapter = new ShipEngineAdapter(shipEngineMock);
    const payload: IFetchRatesPayload = mockRatesPayload();

    // Act
    const result = await adapter.fetchRates(payload);

    // Assert
    expect(result).toEqual({
      id: 'shipment1',
      rates: [],
      shippingAddress: payload.shippingAddress,
      weight: {
        value: 10,
        unit: 'kilogram',
      },
    });
    
    expect(shipEngineMock.getRatesWithShipmentDetails).toHaveBeenCalledWith({
      rateOptions: {
        carrierIds: process.env.SHIPENGINE_CARRIER_IDS.split(','),
      },
      shipment: {
        validateAddress: 'no_validation',
        shipTo: {
          companyName: payload.shippingAddress.companyName || '',
          name: payload.shippingAddress.name || '',
          phone: payload.shippingAddress.phoneNumber || '',
          addressLine1: payload.shippingAddress.addressLine1 || '',
          cityLocality: payload.shippingAddress.city || '',
          stateProvince: payload.shippingAddress.state || '',
          postalCode: payload.shippingAddress.postcode || '',
          countryCode: payload.shippingAddress.country || '',
          addressResidentialIndicator: payload.shippingAddress.companyName ? 'no' : 'yes',
        },
        shipFrom: {
          ...warehouseAddress,
          addressResidentialIndicator: 'no',
        },
        packages: [{ weight: payload.weight }],
      },
    });
  });
});
