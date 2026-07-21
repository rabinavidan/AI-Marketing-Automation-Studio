import { test, expect } from '@playwright/test';
import { uniqueName } from './utils';

test('creating a product brief generates AI content and lands on the result page', async ({ page }) => {
  const productName = uniqueName('Radiant Glow Serum');

  await page.goto('/product-brief');

  await page.getByTestId('input-product-name').fill(productName);
  await page.getByTestId('input-product-category').fill('Skincare');
  await page.getByTestId('input-target-audience').fill('Women 25-40 interested in clean beauty');
  await page.getByTestId('input-main-benefits').fill('Hydrates and brightens skin tone');
  await page.getByTestId('select-tone').selectOption('Premium');
  await page.getByTestId('select-language').selectOption('English');
  await page.getByTestId('select-platform').selectOption('Instagram');

  await page.getByTestId('btn-generate-content').click();

  await expect(page).toHaveURL(/\/generated-content\/[^/]+$/, { timeout: 15000 });
  await expect(page.getByTestId('generated-content-page')).toBeVisible();
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();
  await expect(page.getByTestId('section-product-description')).toBeVisible();
  await expect(page.getByTestId('section-instagram-post')).toBeVisible();
  await expect(page.getByTestId('section-image-prompt')).toBeVisible();
  await expect(page.getByTestId('content-status')).toContainText('Pending Review');
});
