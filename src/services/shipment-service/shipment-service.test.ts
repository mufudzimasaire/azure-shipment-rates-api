import { ShipmentService } from ".";
import { IFetchRatesPayload, IShipment, IShippingAddress } from "../../interfaces";
import { IShipmentRepository } from "../../repositories/shipment-repository";
import { IShipmentAdapter } from "./adapters/shipengine-adapter";
import { ShipmentRatesError } from "./errors/shipment-rates-error";

function mockShippingAddress(): IShippingAddress {
  return {
    companyName: 'Example Corp.',
    name: 'John Doe',
    phoneNumber: '111-111-1111',
    addressLine1: '123 Main St',
    city: 'Austin',
    state: 'TX',
    postcode: '78731',
    country: 'US',
  }
}

function mockRatesPayload(): IFetchRatesPayload {
  return {
    shippingAddress: mockShippingAddress(),
    weight: {
      value: 10,
      unit: 'kilogram',
    },
  }
}

function mockShipment(): IShipment {
  return {
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
    shippingAddress: mockShippingAddress(),
    weight: {
      value: 10,
      unit: 'kilogram',
    },
  }
}

describe('ShipmentService', () => {
  let repositoryMock: jest.Mocked<IShipmentRepository>; 
  let clientMock: jest.Mocked<IShipmentAdapter>;
  let shipmentService;

  beforeEach(() => {
    jest.resetModules();
    repositoryMock = { createShipment: jest.fn().mockResolvedValue(undefined) };
    clientMock = { fetchRates: jest.fn().mockResolvedValue(mockShipment()) };
    shipmentService = new ShipmentService(repositoryMock, clientMock);
  })

  it('should fetch rates and save them to the repository', async () => {
    // Arrange
    const payload: IFetchRatesPayload = mockRatesPayload();
    const shipment: IShipment = mockShipment();

    // Act
    const result = await shipmentService.fetchRates(payload);

    // Assert
    expect(result).toEqual(shipment.rates);
    expect(repositoryMock.createShipment).toHaveBeenCalledWith(shipment);
  });

  it('should return the fetched rates', async () => {
    // Arrange
    const payload: IFetchRatesPayload = mockRatesPayload();

    // Act
    const result = await shipmentService.fetchRates(payload);

    // Assert
    expect(result).toEqual([
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
    ]);
  });

  it('should return an empty array if no shipment is fetched', async () => {
    // Arrange
    const payload: IFetchRatesPayload = mockRatesPayload();
    const clientMock: jest.Mocked<IShipmentAdapter> = {
      fetchRates: jest.fn().mockResolvedValue(null)
    };
    const shipmentService = new ShipmentService(repositoryMock, clientMock);

    // Act
    const result = await shipmentService.fetchRates(payload);

    // Assert
    expect(result).toEqual([]);
  });

  it('should throw a ShipmentRatesError if there was an error getting shipment rates', async () => {
    // Arrange
    const payload: IFetchRatesPayload = mockRatesPayload();
    const error = new Error('Error getting shipment rates');
    const clientMock: jest.Mocked<IShipmentAdapter> = {
      fetchRates: jest.fn().mockRejectedValue(error)
    };
    const shipmentService = new ShipmentService(repositoryMock, clientMock);

    // Act & Assert
    await expect(shipmentService.fetchRates(payload)).rejects.toThrow(ShipmentRatesError);
  });

  it('should call the fetchRates method of the provided client', async () => {
    // Arrange
    const payload: IFetchRatesPayload = mockRatesPayload();
    const clientMock: jest.Mocked<IShipmentAdapter> = {
      fetchRates: jest.fn().mockResolvedValue(null)
    };
    const shipmentService = new ShipmentService(repositoryMock, clientMock);

    // Act
    await shipmentService.fetchRates(payload);

    // Assert
    expect(clientMock.fetchRates).toHaveBeenCalledWith(payload);
  });
});
