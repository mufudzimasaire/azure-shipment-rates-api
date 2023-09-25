# Azure Function for Obtaining Shipment Rates and Persisting to Cosmos DB

This demo Azure Function app provides an API endpoint for retrieving shipment rates for a given shipping address and package weight. It is based on the v3 Node.js programming model and utilizes ShipEngine for rate calculations. The obtained rates are then stored as a `shipment` in Cosmos DB.

The code structure is based on the Service-Repository pattern, and it leverages `InversifyJS` for Inversion of Control (IoC) and Dependency Injection (DI) to manage dependencies efficiently.

## API Endpoint

- **Endpoint**: `POST /api/shipment/rates`

### Example Payload

```json
{
  "shippingAddress": {
    "name": "Muf Mas",
    "phoneNumber": "07800000000",
    "addressLine1": "525 S Winchester Blvd",
    "city": "San Jose",
    "state": "CA",
    "postcode": "95128",
    "country": "US"
  },
  "weight": {
    "value": 1.3,
    "unit": "kilogram"
  }
}
```

### Example Curl Request

```bash
curl -X POST "https://your-azure-function-app-url/api/shipment/rates" \
-H "Content-Type: application/json" \
-d '{
  "shippingAddress": {
    "name": "Muf Mas",
    "phoneNumber": "07800000000",
    "addressLine1": "525 S Winchester Blvd",
    "city": "San Jose",
    "state": "CA",
    "postcode": "95128",
    "country": "US"
  },
  "weight": {
    "value": 1.3,
    "unit": "kilogram"
  }
}'
```

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js and npm installed on your development environment.
- Azure Functions Core Tools installed (for local development).
- ShipEngine API key for rate generation.
- Azure Cosmos DB account with valid credentials.

## Project Setup

To set up this project, follow these steps:

1. Clone this repository to your local environment.
2. Install project dependencies by running `npm install`.
3. Configure your ShipEngine API credentials and Cosmos DB settings. Set the following environment variables in `local.settings.json`:

    - `COSMOS_DB_ENDPOINT`: Cosmos DB endpoint URL.
    - `COSMOS_DB_KEY`: Cosmos DB access key.
    - `DATABASE_CONTAINER_NAME`: Name of the Cosmos DB container.
    - `DATABASE_NAME`: Name of the Cosmos DB database.
    - `SHIPENGINE_API_KEY`: Your ShipEngine API key.
    - `SHIPENGINE_CARRIER_IDS`: Carrier IDs for ShipEngine (comma-separated).

## TODO

- Implement the `ShipmentRepository` and corresponding unit tests.
- Implement middleware for validating API payload
- Add an additional endpoint for retrieving a shipment by its ID `/api/shipment/:id`.