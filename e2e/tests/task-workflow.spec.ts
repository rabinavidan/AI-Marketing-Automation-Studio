import { test, expect } from '@playwright/test';
import { uniqueName } from './utils';

test('creating a task and updating its status reflects in the task list', async ({ page }) => {
  const taskTitle = uniqueName('Design Instagram Carousel');

  await page.goto('/tasks');

  await page.getByTestId('btn-create-task').click();
  await page.getByTestId('input-task-title').fill(taskTitle);
  await page.getByTestId('input-task-product').fill('Lumina Vitamin C Serum');
  await page.getByTestId('input-task-content-type').fill('Instagram Post');
  await page.getByTestId('input-task-assignee').fill('Dana Cohen');
  await page.getByTestId('select-task-priority').selectOption('High');
  await page.getByTestId('btn-submit-task').click();

  const row = page.getByTestId('task-row').filter({ hasText: taskTitle });
  await expect(row).toBeVisible({ timeout: 10000 });
  await expect(row.getByTestId('select-task-status')).toHaveValue('To Do');

  await row.getByTestId('select-task-status').selectOption('In Progress');

  await expect(row.getByTestId('select-task-status')).toHaveValue('In Progress');
});
