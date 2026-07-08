// Shipping calculation for Nigeria

export interface ShippingAddress {
  city: string
  state: string
  postal_code: string
}

export interface ShippingRate {
  method: string
  cost: number
  estimated_days: string
}

export function calculateShipping(
  subtotal: number,
  address: ShippingAddress
): ShippingRate[] {
  const rates: ShippingRate[] = []

  // Standard shipping (within Lagos)
  if (address.state.toLowerCase() === 'lagos') {
    rates.push({
      method: 'Standard Delivery (Lagos)',
      cost: 2500,
      estimated_days: '1-2 business days',
    })
  } else {
    rates.push({
      method: 'Standard Delivery',
      cost: 3500,
      estimated_days: '3-5 business days',
    })
  }

  // Express shipping
  if (address.state.toLowerCase() === 'lagos') {
    rates.push({
      method: 'Express Delivery (Lagos)',
      cost: 5000,
      estimated_days: 'Same day / Next day',
    })
  } else {
    rates.push({
      method: 'Express Delivery',
      cost: 7500,
      estimated_days: '1-2 business days',
    })
  }

  // Free shipping for orders over ₦100,000
  if (subtotal >= 100000) {
    rates.push({
      method: 'Free Shipping',
      cost: 0,
      estimated_days: '5-7 business days',
    })
  }

  return rates
}

export function getShippingCost(
  subtotal: number,
  address: ShippingAddress,
  method: string = 'Standard Delivery'
): number {
  const rates = calculateShipping(subtotal, address)
  const selectedRate = rates.find((rate) => rate.method === method)
  return selectedRate?.cost || 3500
}
