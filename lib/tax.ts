// Tax calculation for Nigeria

export interface TaxCalculation {
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
}

export function calculateTax(subtotal: number): TaxCalculation {
  // Nigeria VAT rate is 7.5%
  const tax_rate = 0.075
  const tax_amount = subtotal * tax_rate
  const total = subtotal + tax_amount

  return {
    subtotal,
    tax_rate,
    tax_amount,
    total,
  }
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`
}
