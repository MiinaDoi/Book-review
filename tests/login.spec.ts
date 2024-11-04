import { test, expect, Page } from '@playwright/test';

test.describe('Login Form Tests', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:5173');
  });

  test('displays error messages for invalid inputs', async ({ page }: { page: Page }) => {
    await page.fill('input[type="email"]', 'testuser');
    await page.fill('input[type="password"]', '123');
    await page.click('button');
    
    await expect(page.locator('text="Email address should include @"')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text="Password must be at least 6 characters"')).toBeVisible({ timeout: 5000 });
  });

  test('no error messages for valid inputs', async ({ page }: { page: Page }) => {
    await page.fill('input[type="email"]', 'testuser@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button');
    
    await expect(page.locator('.error')).toHaveCount(0);
  });
});
