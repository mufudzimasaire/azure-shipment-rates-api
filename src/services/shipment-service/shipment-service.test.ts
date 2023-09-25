import { ShipmentService } from ".";
import { IFetchRatesPayload, IShipment, IShippingAddress } from "../../interfaces";
import { IShipmentRepository } from "../../repositories/shipment-repository";
import { IShipmentAdapter } from "./adapters/shipengine-adapter";
import { ShipmentRatesError } from "./errors/shipment-rates-error";
import { ShipmentError } from "./errors/shipment-error";

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

function mockShipment(id = 'shipment1'): IShipment {
  return {
    id,
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
    repositoryMock = {
      createShipment: jest.fn().mockResolvedValue(undefined),
      findShipment: jest.fn().mockResolvedValue(mockShipment())
    };
    clientMock = { fetchRates: jest.fn().mockResolvedValue(mockShipment()) };
    shipmentService = new ShipmentService(repositoryMock, clientMock);
  })

  describe('fetchRates', () => {
    it('should fetch rates and save them to the repository', async () => {
      // Arrange
      const payload: IFetchRatesPayload = mockRatesPayload();
      const shipment: IShipment = mockShipment();

      // Act
      const result = await shipmentService.fetchRates(payload);

      // Assert
      expect(result).toEqual(shipment);
      expect(repositoryMock.createShipment).toHaveBeenCalledWith(shipment);
    });

    it('should return the fetched rates', async () => {
      // Arrange
      const payload: IFetchRatesPayload = mockRatesPayload();
      const shipment: IShipment = mockShipment();

      // Act
      const result = await shipmentService.fetchRates(payload);

      // Assert
      expect(result).toEqual(shipment);
    });

    it('should return null if no shipment is fetched', async () => {
      // Arrange
      const clientMock: jest.Mocked<IShipmentAdapter> = {
        fetchRates: jest.fn().mockResolvedValue(null)
      };
      const shipmentService = new ShipmentService(repositoryMock, clientMock);

      // Act
      const result = await shipmentService.fetchRates({} as any);

      // Assert
      expect(result).toEqual(null);
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


  describe('findShipment', () => {
    it('should return a shipment object when a valid ID is provided and the shipment exists in the repository', async () => {
      // Arrange
      const shipment = mockShipment()
      const shipmentService = new ShipmentService(repositoryMock, clientMock);

      // Act
      const result = await shipmentService.findShipment(shipment.id);

      // Assert
      expect(result).toEqual(shipment);
      expect(repositoryMock.findShipment).toHaveBeenCalledWith(shipment.id);
    });

    it('should return null when a valid ID is provided but the shipment does not exist in the repository', async () => {
      // Arrange
      const id = 'validId';
      const repositoryMock = {
        createShipment: jest.fn().mockResolvedValue(undefined),
        findShipment: jest.fn().mockResolvedValue(null)
      };
      const shipmentService = new ShipmentService(repositoryMock, clientMock);

      // Act
      const result = await shipmentService.findShipment(id);

      // Assert
      expect(result).toBeNull();
      expect(repositoryMock.findShipment).toHaveBeenCalledWith(id);
    });

    it('should throw a ShipmentError when an error occurs while fetching the shipment from the repository', async () => {
      // Arrange
      const id = 'validId';
      const repositoryMock = {
        createShipment: jest.fn().mockResolvedValue(undefined),
        findShipment: jest.fn().mockRejectedValue(new Error('Error fetching shipment'))
      };
      const shipmentService = new ShipmentService(repositoryMock, clientMock);

      // Act & Assert
      await expect(shipmentService.findShipment(id)).rejects.toThrow(ShipmentError);
      expect(repositoryMock.findShipment).toHaveBeenCalledWith(id);
    });
  });
});
