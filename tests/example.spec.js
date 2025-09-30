// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  const username = process.env.TECHSITE_USER;
  const password = process.env.TECHSITE_PASSWORD;
  if (!username || !password) {
    throw new Error('TECHSITE_USER and TECHSITE_PASSWORD must be set in the environment (or in .env)');
  }

  await page.addInitScript("Object.defineProperty(navigator, 'webdriver', { get: () => false });");
  await page.goto('https://www.motorcraftservice.com/SetCountry');
  await page.locator("#selectedCountry").selectOption("Canada");
  await expect(page.locator("#selectedLanguage >> option:checked")).toHaveText("English");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.locator("#btnLogin")).toBeVisible();
  await page.waitForTimeout(1000);
  await page.locator("#btnLogin").click();
  await page.locator("#signInName").fill(username);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL(/MySubscriptions/);
  var locatorSubscriptionLink = page.locator("table > tbody > tr:first-child > td:first-child > a");
  await expect(locatorSubscriptionLink).toBeVisible();
  await page.waitForTimeout(1000);
  var subscriptionLink = await locatorSubscriptionLink.getAttribute("href") ?? "";
  // var subscriptionUrl = CombineUrl(page.url(), subscriptionLink);
  var subscriptionUrl = new URL(subscriptionLink, page.url()).toString();
  console.log(`Subscription URL: ${subscriptionUrl}`);
  await page.goto(subscriptionUrl);
  await page.waitForURL("https://www.fordtechservice.dealerconnection.com/");
  await expect(page.getByRole("heading", { name: "Ford Service Info" })).toBeVisible();
});
