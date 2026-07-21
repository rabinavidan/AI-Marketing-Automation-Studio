import { test, expect } from '@playwright/test';
import { uniqueName } from './utils';

test('approving a generated content item updates its status to Approved', async ({ page }) => {
  const productName = uniqueName('Velora Night Cream');

  // Generate a fresh content item so this test doesn't depend on seed data state.
  await page.goto('/product-brief');
  await page.getByTestId('input-product-name').fill(productName);
  await page.getByTestId('input-product-category').fill('Skincare');
  await page.getByTestId('input-target-audience').fill('Women 30-50');
  await page.getByTestId('select-tone').selectOption('Luxury');
  await page.getByTestId('select-language').selectOption('English');
  await page.getByTestId('select-platform').selectOption('Website');
  await page.getByTestId('btn-generate-content').click();

  await expect(page).toHaveURL(/\/generated-content\/[^/]+$/, { timeout: 15000 });
  await expect(page.getByTestId('content-status')).toContainText('Pending Review');

  await page.getByTestId('btn-approve').click();

  await expect(page.getByTestId('content-status')).toContainText('Approved');
});
