import { Page, expect } from '@playwright/test';

// Test credentials - in production, these should come from environment variables
export const TEST_CREDENTIALS = {
  username: process.env.TEST_USERNAME || 'u0',
  password: process.env.TEST_PASSWORD || '1234'
};


/**
 * Login helper function for regular users
 */
export async function loginAsUser(page: Page) {
  await page.goto('/login');
  await page.getByTestId('username-input').fill(TEST_CREDENTIALS.username);
  await page.getByTestId('password-input').fill(TEST_CREDENTIALS.password);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/');
}


/**
 * Logout helper function
 */
export async function logout(page: Page) {
  const logoutButton = page.getByRole('button', { name: /logout/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await expect(page).toHaveURL('/');
  }
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const welcomeMessage = page.getByText(/welcome/i);
  return await welcomeMessage.isVisible();
}

/**
 * Ensure user is logged out
 */
export async function ensureLoggedOut(page: Page) {
  if (await isLoggedIn(page)) {
    await logout(page);
  }
}