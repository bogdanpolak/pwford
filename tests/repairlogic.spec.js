import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  const username = process.env.OEMIQ_USER;
  const password = process.env.OEMIQ_PASSWORD;
  if (!username || !password) {
    throw new Error('OEMIQ_USER and OEMIQ_PASSWORD must be set in the environment (or in .env)');
  }

  await page.goto('https://www.repairlogic.com/');
  await page.getByTestId('email').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('repair-plans-title')).toContainText('Repair Plans');
  await page.getByRole('button', { name: 'New Plan' }).click();
  await page.getByRole('button', { name: 'With a VIN/YMM' }).click();
  await page.locator('#years').selectOption('2025');
  await page.locator('#oems').selectOption('1');
  await page.locator('#models').selectOption('40');
  await page.locator('#trims').selectOption('19');
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.getByTestId('side-nav-plan-vehicle-name')).toContainText('2025 Ford Bronco Base');
  await expect(page.getByRole('textbox', { name: 'Search all procedures for' })).toBeVisible();
  await expect(page.locator('#static-group-container')).toContainText('Calibration Guide');
  const calibrationGuideButton = page.locator('#static-group-container').getByText('Calibration Guide');
  await expect(calibrationGuideButton).toBeVisible();
  await calibrationGuideButton.click();
  await expect(page.getByRole('heading', { name: 'Calibration Guide' })).toBeVisible();
});
