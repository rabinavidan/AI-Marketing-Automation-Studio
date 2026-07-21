import { test, expect } from '@playwright/test';

test('submitting the product brief form empty shows required field errors', async ({ page }) => {
  await page.goto('/product-brief');

  await page.getByTestId('btn-generate-content').click();

  await expect(page.getByTestId('error-product-name')).toBeVisible();
  await expect(page.getByTestId('error-product-category')).toBeVisible();
  await expect(page.getByTestId('error-target-audience')).toBeVisible();

  // Platform/Language are selects with a default value, so they should never
  // block submission -- the page should stay on /product-brief either way.
  await expect(page).toHaveURL(/\/product-brief$/);
});
