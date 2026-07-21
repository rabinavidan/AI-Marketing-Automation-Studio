import { test, expect } from '@playwright/test';

test('copying a prompt from the Prompt Library shows copy feedback', async ({ page }) => {
  await page.goto('/prompt-library');

  const firstCard = page.getByTestId('prompt-card').first();
  await expect(firstCard).toBeVisible();

  await firstCard.getByTestId('btn-copy-prompt').click();

  await expect(firstCard.getByTestId('copy-feedback')).toBeVisible();
  await expect(firstCard.getByTestId('copy-feedback')).toContainText('Copied');
});
