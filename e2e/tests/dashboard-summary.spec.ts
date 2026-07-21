import { test, expect } from '@playwright/test';

test('dashboard shows summary cards and the content table', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.getByTestId('summary-card-total')).toBeVisible();
  await expect(page.getByTestId('summary-card-pending')).toBeVisible();
  await expect(page.getByTestId('summary-card-approved')).toBeVisible();
  await expect(page.getByTestId('summary-card-rejected')).toBeVisible();
  await expect(page.getByTestId('summary-card-campaigns-ready')).toBeVisible();
  await expect(page.getByTestId('summary-card-tasks-in-progress')).toBeVisible();

  // Values should load in (not remain the "—" loading placeholder).
  await expect(page.getByTestId('summary-card-total')).not.toContainText('—', { timeout: 15000 });

  await expect(page.getByTestId('dashboard-table')).toBeVisible();
});
