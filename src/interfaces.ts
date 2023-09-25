export interface IWeight {
  value: number
  unit: 'kilogram' | 'ounce' | 'pound' | 'gram'
}

export interface IShippingAddress {
  addressLine1: string
  addressLine2?: string
  city: string
  companyName: string
  country: string
  name: string
  phoneNumber: string
  postcode: string
  state: string
}

export interface IRate {
  id: string
  carrier: string
  carrierCode: string
  carrierId: string
  confirmationAmount: number
  currency: string
  deliveryDays: number
  estimatedDeliveryDate: string
  insuranceAmount: number
  serviceCode: string
  shipDate: string
  shipmentAmount: number
  trackable: boolean
}

export interface IShipment {
  id: string,
  rates: IRate[]
  shippingAddress: IShippingAddress,
  weight: IWeight,
}

export interface IFetchRatesPayload {
  shippingAddress: IShippingAddress;
  weight: IWeight;
}
