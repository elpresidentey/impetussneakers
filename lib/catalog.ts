export const TEST_PRODUCT_NAMES = new Set([
  'essential cotton hoodie',
  'premium cotton t-shirt',
  'performance joggers',
  'classic leather crossbody',
  'minimalist analog watch',
  'premium polarized sunglasses',
  'classic baseball cap',
  'durable canvas backpack',
  'athletic performance socks',
  'genuine leather belt',
  'premium phone wallet case',
  'classic crew neck sweater',
])

export function isTestProductName(name: string): boolean {
  return TEST_PRODUCT_NAMES.has(name.trim().toLocaleLowerCase())
}
