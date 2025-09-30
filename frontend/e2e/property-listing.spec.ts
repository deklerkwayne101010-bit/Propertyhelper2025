import { test, expect } from '@playwright/test';

test.describe('Property Listing Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display the main page', async ({ page }) => {
    // Check if the main page loads
    await expect(page).toHaveTitle(/Property Helper/);

    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate to property listing page', async ({ page }) => {
    // Click on property listing link/button
    await page.click('text=List Property');

    // Wait for navigation
    await page.waitForURL('**/property-listing');

    // Check if we're on the property listing page
    await expect(page.locator('h1')).toContainText('List Your Property');
  });

  test('should complete property listing wizard', async ({ page }) => {
    // Navigate to property listing
    await page.goto('/property-listing');

    // Step 1: Property Basics
    await page.fill('[name="title"]', 'Beautiful Family Home');
    await page.fill('[name="description"]', 'A spacious family home in a quiet neighborhood');
    await page.selectOption('[name="propertyType"]', 'HOUSE');
    await page.click('text=Next');

    // Step 2: Address Lookup
    await page.fill('[name="address"]', '123 Main Street');
    await page.fill('[name="city"]', 'Johannesburg');
    await page.fill('[name="province"]', 'Gauteng');
    await page.fill('[name="postalCode"]', '2000');
    await page.click('text=Next');

    // Step 3: Property Details
    await page.fill('[name="bedrooms"]', '3');
    await page.fill('[name="bathrooms"]', '2');
    await page.fill('[name="garages"]', '1');
    await page.fill('[name="floorSize"]', '150');
    await page.fill('[name="erfSize"]', '500');
    await page.click('text=Next');

    // Step 4: Media Upload
    // Skip media upload for this test
    await page.click('text=Skip for now');

    // Step 5: Pricing
    await page.fill('[name="price"]', '1500000');
    await page.selectOption('[name="priceType"]', 'SALE');
    await page.click('text=Next');

    // Step 6: Review
    await expect(page.locator('text=Beautiful Family Home')).toBeVisible();
    await expect(page.locator('text=Johannesburg')).toBeVisible();
    await expect(page.locator('text=R 1,500,000')).toBeVisible();

    // Submit the listing
    await page.click('text=Submit Listing');

    // Check for success message
    await expect(page.locator('text=Property listed successfully')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/property-listing');

    // Try to proceed without filling required fields
    await page.click('text=Next');

    // Check for validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Property type is required')).toBeVisible();
  });

  test('should handle address autocomplete', async ({ page }) => {
    await page.goto('/property-listing');

    // Complete first step
    await page.fill('[name="title"]', 'Test Property');
    await page.selectOption('[name="propertyType"]', 'HOUSE');
    await page.click('text=Next');

    // Test address lookup
    await page.fill('[name="address"]', 'Sandton');
    await page.waitForSelector('.autocomplete-suggestions');

    // Select first suggestion
    await page.click('.autocomplete-suggestions li:first-child');

    // Check if address fields are populated
    await expect(page.locator('[name="city"]')).not.toBeEmpty();
    await expect(page.locator('[name="province"]')).not.toBeEmpty();
  });

  test('should upload property images', async ({ page }) => {
    await page.goto('/property-listing');

    // Complete steps to reach media upload
    await page.fill('[name="title"]', 'Test Property');
    await page.selectOption('[name="propertyType"]', 'HOUSE');
    await page.click('text=Next'); // Basics
    await page.click('text=Next'); // Address (skip for now)
    await page.click('text=Next'); // Details (skip for now)

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-data/sample-house.jpg');

    // Check if image preview appears
    await expect(page.locator('.image-preview')).toBeVisible();
  });

  test('should calculate estimated property value', async ({ page }) => {
    await page.goto('/property-listing');

    // Complete steps to reach pricing
    await page.fill('[name="title"]', 'Test Property');
    await page.selectOption('[name="propertyType"]', 'HOUSE');
    await page.click('text=Next'); // Basics
    await page.click('text=Next'); // Address
    await page.fill('[name="bedrooms"]', '3');
    await page.fill('[name="bathrooms"]', '2');
    await page.fill('[name="floorSize"]', '150');
    await page.click('text=Next'); // Details
    await page.click('text=Next'); // Media

    // Check if estimated value is shown
    await expect(page.locator('text=Estimated Value')).toBeVisible();
    await expect(page.locator('.estimated-value')).toBeVisible();
  });

  test('should handle form navigation', async ({ page }) => {
    await page.goto('/property-listing');

    // Go forward through steps
    await page.fill('[name="title"]', 'Test Property');
    await page.selectOption('[name="propertyType"]', 'HOUSE');
    await page.click('text=Next');

    // Go back
    await page.click('text=Back');

    // Check if we're back on first step
    await expect(page.locator('[name="title"]')).toHaveValue('Test Property');

    // Go forward again
    await page.click('text=Next');

    // Check progress indicator
    await expect(page.locator('.step-indicator.active')).toHaveText('2');
  });

  test('should save draft automatically', async ({ page }) => {
    await page.goto('/property-listing');

    // Fill some data
    await page.fill('[name="title"]', 'Draft Property');

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Refresh page
    await page.reload();

    // Check if data is restored
    await expect(page.locator('[name="title"]')).toHaveValue('Draft Property');
  });

  test('should display property listing success', async ({ page }) => {
    // This test assumes a completed property listing
    await page.goto('/dashboard');

    // Check if the new property appears in the dashboard
    await expect(page.locator('text=Beautiful Family Home')).toBeVisible();
    await expect(page.locator('.property-card')).toBeVisible();
  });
});