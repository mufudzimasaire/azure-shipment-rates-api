# Azure Function for Obtaining Shipment Rates and Persisting to Cosmos DB

This demo Azure Function App provides an API endpoint for fetching shipment rates for a given shipping address and package weight along with an endpoint for retrieving shipment details by id. The app is based on the v3 Node.js programming model and it utilizes [ShipEngine](https://www.shipengine.com/) for rate calculations. The obtained rates are then stored as a `shipment` resource in Cosmos DB.

The code structure is based on the Repository-Service pattern, and it leverages `InversifyJS` for Inversion of Control (IoC) and Dependency Injection (DI) to manage dependencies efficiently.

## API Endpoints
#### Fetch Shipment Rates Endpoint
<details>
  <summary>POST /api/shipment/rates</summary>

  ##### Example payload
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

  ##### Example Curl Command
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

  ##### Example Response
  ```json
    {
      "id": "se-148484135",
      "rates": [
        {
          "id": "se-2942502",
          "carrier": "UPS Next Day Air®",
          "carrierCode": "ups",
          "carrierId": "se-132913",
          "confirmationAmount": 0,
          "currency": "usd",
          "deliveryDays": 1,
          "estimatedDeliveryDate": "2023-09-26T12:00:00Z",
          "insuranceAmount": 0,
          "serviceCode": "ups_next_day_air",
          "shipDate": "2023-09-25T00:00:00Z",
          "shipmentAmount": 137.67,
          "trackable": true
        },
        {
          "id": "se-2942503",
          "carrier": "UPS 2nd Day Air®",
          "carrierCode": "ups",
          "carrierId": "se-132913",
          "confirmationAmount": 0,
          "currency": "usd",
          "deliveryDays": 2,
          "estimatedDeliveryDate": "2023-09-27T23:00:00Z",
          "insuranceAmount": 0,
          "serviceCode": "ups_2nd_day_air",
          "shipDate": "2023-09-25T00:00:00Z",
          "shipmentAmount": 59.89,
          "trackable": true
        }
      ],
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
</details> 

#### Retrieve Shipment Details Endpoint
<details>
  <summary>GET /api/shipment/:id</summary>

  ##### Example Curl command
  ```bash
    curl -X GET "https://your-azure-function-app-url/api/shipment/<SHIPMENT_ID>"
  ```

  ##### Example Response
  ```json
    {
      "id": "se-148484135",
      "rates": [
        {
          "id": "se-2942502",
          "carrier": "UPS Next Day Air®",
          "carrierCode": "ups",
          "carrierId": "se-132913",
          "confirmationAmount": 0,
          "currency": "usd",
          "deliveryDays": 1,
          "estimatedDeliveryDate": "2023-09-26T12:00:00Z",
          "insuranceAmount": 0,
          "serviceCode": "ups_next_day_air",
          "shipDate": "2023-09-25T00:00:00Z",
          "shipmentAmount": 137.67,
          "trackable": true
        },
        {
          "id": "se-2942503",
          "carrier": "UPS 2nd Day Air®",
          "carrierCode": "ups",
          "carrierId": "se-132913",
          "confirmationAmount": 0,
          "currency": "usd",
          "deliveryDays": 2,
          "estimatedDeliveryDate": "2023-09-27T23:00:00Z",
          "insuranceAmount": 0,
          "serviceCode": "ups_2nd_day_air",
          "shipDate": "2023-09-25T00:00:00Z",
          "shipmentAmount": 59.89,
          "trackable": true
        }
      ],
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
      },
      "_rid": "KqYMAJLeSqACAAAAAAAAAA==",
      "_self": "dbs/KqYMAA==/colls/KqYMAJLeSqA=/docs/KqYMAJLeSqACAAAAAAAAAA==/",
      "_etag": "\"5d05c06b-0000-0700-0000-65119fb90000\"",
      "_attachments": "attachments/",
      "_ts": 1695653817
    }
  ```

</details> 

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
    - `DATABASE_CONTAINER`: Name of the Cosmos DB container.
    - `DATABASE_NAME`: Name of the Cosmos DB database.
    - `SHIPENGINE_API_KEY`: Your free [ShipEngine API key](https://www.shipengine.com/uk/signup/).
    - `SHIPENGINE_CARRIER_IDS`: Carrier IDs for ShipEngine (comma-separated).
