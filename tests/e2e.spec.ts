import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    expect(errors).toHaveLength(0)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1')).toContainText('Stay Laced')
  })

  test('should display product cards', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should add product to cart and show cart count', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    const firstAddToCart = page.locator('[data-testid="add-to-cart"]').first()
    await expect(firstAddToCart).toBeVisible()
    
    await firstAddToCart.click()
    
    const cartBadge = page.locator('[data-testid="cart-count"]')
    await expect(cartBadge).toHaveText('1')
  })

  test('should open cart modal and show added product', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    const firstAddToCart = page.locator('[data-testid="add-to-cart"]').first()
    await firstAddToCart.click()
    
    const cartButton = page.locator('[data-testid="cart-button"]')
    await cartButton.click()
    
    const cartModal = page.locator('[data-testid="cart-modal"]')
    await expect(cartModal).toBeVisible()
    
    const cartItem = page.locator('[data-testid="cart-item"]').first()
    await expect(cartItem).toBeVisible()
  })

  test('should update quantity in cart', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    await page.locator('[data-testid="add-to-cart"]').first().click()
    
    await page.locator('[data-testid="cart-button"]').click()
    
    const cartModal = page.locator('[data-testid="cart-modal"]')
    await expect(cartModal).toBeVisible()
    
    await page.locator('[data-testid="quantity-increase"]').first().click()
    
    const quantity = page.locator('[data-testid="quantity-value"]').first()
    await expect(quantity).toHaveText('2')
  })

  test('should remove item from cart', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    await page.locator('[data-testid="add-to-cart"]').first().click()
    
    await page.locator('[data-testid="cart-button"]').click()
    
    await page.locator('[data-testid="remove-from-cart"]').first().click()
    
    const emptyCart = page.locator('[data-testid="empty-cart"]')
    await expect(emptyCart).toBeVisible()
  })
})

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.locator('[data-testid="add-to-cart"]').first().click()
  })

  test('should navigate to checkout page', async ({ page }) => {
    await page.locator('[data-testid="cart-button"]').click()
    
    const checkoutBtn = page.locator('[data-testid="checkout-button"]')
    await checkoutBtn.click()
    
    await expect(page).toHaveURL(/.*checkout/)
  })

  test('should show shipping form on checkout', async ({ page }) => {
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('input[name="firstName"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="address"]')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)
  })

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })
})