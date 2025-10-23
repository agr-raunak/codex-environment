import { test, expect } from '@playwright/test';

test('user can submit intake form and view roadmap with grade', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Personal learning roadmaps crafted for ambitious students' })).toBeVisible();

  await page.fill('input#name', 'Test Student');
  await page.fill('input#email', 'student@example.com');
  await page.click('#current_level');
  await page.getByRole('option', { name: 'Intermediate' }).click();
  await page.fill('input#time_per_week_hours', '8');
  await page.fill('textarea#goal', 'Ship a polished AI mentor MVP with tests and docs.');
  await page.fill('input#deadline_weeks', '6');
  await page.click('#consent');

  await page.getByRole('button', { name: 'Generate roadmap' }).click();

  await expect(page.getByRole('heading', { name: 'Roadmap preview' })).toBeVisible();

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Get AI grade' }).click();
  await expect(page.locator('pre').nth(0)).toContainText('grade_letter');
});
