import { test, expect } from '@playwright/test';

test('generating an image prompt produces a usable output with copy feedback', async ({ page }) => {
  await page.goto('/image-prompt-generator');

  await page.getByTestId('input-image-product-name').fill('Radiant Glow Serum');
  await page.getByTestId('input-product-type').fill('Skincare bottle');
  await page.getByTestId('input-visual-style').fill('Minimalist editorial');
  await page.getByTestId('input-background').fill('Soft marble surface');
  await page.getByTestId('input-lighting').fill('Soft studio lighting');
  await page.getByTestId('input-mood').fill('Calm, luxurious');
  await page.getByTestId('input-brand-style').fill('Clean beauty, premium');
  await page.getByTestId('select-aspect-ratio').selectOption('1:1');
  await page.getByTestId('select-tool').selectOption('Midjourney');

  await page.getByTestId('btn-generate-image-prompt').click();

  const output = page.getByTestId('image-prompt-output');
  await expect(output).toBeVisible({ timeout: 10000 });
  await expect(output).not.toBeEmpty();

  await page.getByTestId('btn-copy-image-prompt').click();
  await expect(page.getByTestId('copy-feedback')).toBeVisible();
});
