import { ShipmentRepository } from ".";
import { DatabaseConflictError } from "../../errors/database-conflict-error";
import { IShipment } from "../../interfaces";

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

describe('ShipmentRepository', () => {
  let mockCosmosClient; 
  let mockDatabase;
  let mockContainer;
  let shipmentRepository;

  describe('valid payload', () => {
    beforeEach(() => {
      mockContainer = {
        items: { create: jest.fn().mockResolvedValue(mockShipment()) }
      };
      mockDatabase = { container: jest.fn().mockReturnValue(mockContainer) };
      mockCosmosClient = { database: jest.fn().mockReturnValue(mockDatabase) };
      shipmentRepository = new ShipmentRepository(mockCosmosClient);
    });

    it('should create a shipment successfully', async () => {
      // Arrange
      const shipmentRepository = new ShipmentRepository(mockCosmosClient);
      const shipment: IShipment = mockShipment();

      // Act
      await shipmentRepository.createShipment(mockShipment());

      // Assert
      expect(mockContainer.items.create).toHaveBeenCalledWith(shipment);
    });

    it('should create multiple shipments successfully', async () => {
      // Arrange
      const shipmentRepository = new ShipmentRepository(mockCosmosClient);
      const shipments: IShipment[] = [mockShipment('123'), mockShipment('456')];

      // Act
      for (const shipment of shipments) {
        await shipmentRepository.createShipment(shipment);
      }

      // Assert
      expect(mockContainer.items.create).toHaveBeenCalledTimes(2);
      expect(mockContainer.items.create).toHaveBeenNthCalledWith(1, shipments[0]);
      expect(mockContainer.items.create).toHaveBeenNthCalledWith(2, shipments[1]);
    });
  });

  describe('invalid payload', () => {
    beforeEach(() => {
      mockContainer = {
        items: { create: jest.fn().mockRejectedValue(new Error('DB error')) }
      };
      mockDatabase = { container: jest.fn().mockReturnValue(mockContainer) };
      mockCosmosClient = { database: jest.fn().mockReturnValue(mockDatabase) };
      shipmentRepository = new ShipmentRepository(mockCosmosClient);
    });

    it('should throw DatabaseConflictError when creating a shipment with missing required fields', async () => {
      // Arrange
      const shipmentRepository = new ShipmentRepository(mockCosmosClient);
      const shipment: any = {};

      // Act & Assert
      await expect(shipmentRepository.createShipment(shipment)).rejects.toThrow(DatabaseConflictError);
    });

    it('should throw an error when creating a shipment with invalid field types', async () => {
      // Arrange
      const shipmentRepository = new ShipmentRepository(mockCosmosClient);
      const shipment: IShipment = {
        id: '123',
        rates: [],
        shippingAddress: {
          addressLine1: '123 Main St',
          city: 'Anytown',
          companyName: 'My Company',
          country: 'USA',
          postcode: '12345',
          state: 'NY',
          addressLine2: 'Apt 4B',
          name: 'John Doe',
          phoneNumber: '2222222'
        },
        weight: 'invalid' as any
      };

      // Act & Assert
      await expect(shipmentRepository.createShipment(shipment)).rejects.toThrow();
    });
  });
});
