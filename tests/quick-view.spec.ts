import { test, expect } from '@playwright/test'

test.describe('Product Quick View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should open quick view modal on product click', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    // Click on product card (not add to cart)
    const productCard = page.locator('[data-testid="product-card"]').first()
    await productCard.click()
    
    // Quick view modal should open
    const quickViewModal = page.locator('[data-testid="quick-view-modal"]')
    await expect(quickViewModal).toBeVisible()
    
    // Should have product details
    await expect(page.locator('[data-testid="quick-view-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="quick-view-price"]')).toBeVisible()
    await expect(page.locator('[data-testid="quick-view-add-to-cart"]')).toBeVisible()
  })

  test('should select size and color in quick view', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    const productCard = page.locator('[data-testid="product-card"]').first()
    await productCard.click()
    
    const quickViewModal = page.locator('[data-testid="quick-view-modal"]')
    await expect(quickViewModal).toBeVisible()
    
    // Select a size
    const sizeBtn = page.locator('[data-testid="size-option"]').first()
    await sizeBtn.click()
    await expect(sizeBtn).toHaveClass(/selected|active/)
    
    // Select a color
    const colorBtn = page.locator('[data-testid="color-option"]').first()
    await colorBtn.click()
    await expect(colorBtn).toHaveClass(/selected|active/)
  })

  test('should add to cart from quick view', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    const productCard = page.locator('[data-testid="product-card"]').first()
    await productCard.click()
    
    const quickViewModal = page.locator('[data-testid="quick-view-modal"]')
    await expect(quickViewModal).toBeVisible()
    
    // Select size
    await page.locator('[data-testid="size-option"]').first().click()
    
    // Add to cart
    await page.locator('[data-testid="quick-view-add-to-cart"]').click()
    
    // Cart count should update
    const cartBadge = page.locator('[data-testid="cart-count"]')
    await expect(cartBadge).toHaveText('1')
    
    // Modal should close
    await expect(quickViewModal).not.toBeVisible()
  })
})