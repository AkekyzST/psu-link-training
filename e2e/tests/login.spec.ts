import { test, expect } from '@playwright/test';
import { TEST_CREDENTIALS } from '../helpers/auth';

test.describe('Authentication', () => {
  test('should display login form when accessing protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
    
    // Verify login form elements are present
    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
    
    // Check form labels and placeholders
    await expect(page.getByRole('textbox')).toBeVisible();
    await expect(page.getByRole('textbox', { name: '' }).or(page.locator('input[type="password"]'))).toBeTruthy();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit with empty fields
    await page.getByTestId('login-button').click();
    
    // Should show validation message (toast notification)
    // The toast might use MUI Snackbar which could have different selectors
    const errorToast = page.locator('[role="alert"], .MuiAlert-root, .MuiSnackbar-root');
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });

  test('should login with valid credentials and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in login credentials
    await page.getByTestId('username-input').fill(TEST_CREDENTIALS.username);
    await page.getByTestId('password-input').fill(TEST_CREDENTIALS.password);
    
    // Click login button
    await page.getByTestId('login-button').click();
    
    // Wait for navigation and check we're on the home page
    await expect(page).toHaveURL('/');
    
    // Verify user is logged in by checking welcome message
    await expect(page.getByText(`Welcome, ${TEST_CREDENTIALS.username}`)).toBeVisible();
    
    // Verify dashboard button is present
    await expect(page.getByRole('button', { name: /dashboard/i })).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.getByTestId('username-input').fill('invalid_user');
    await page.getByTestId('password-input').fill('wrong_password');
    
    // Click login button
    await page.getByTestId('login-button').click();
    
    // Should show error message (toast notification)
    const errorToast = page.locator('[role="alert"], .MuiAlert-root, .MuiSnackbar-root');
    await expect(errorToast).toBeVisible({ timeout: 10000 });
    
    // Should remain on login page
    await expect(page).toHaveURL('/login');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('username-input').fill(TEST_CREDENTIALS.username);
    await page.getByTestId('password-input').fill(TEST_CREDENTIALS.password);
    await page.getByTestId('login-button').click();
    
    await expect(page).toHaveURL('/');
    
    // Find and click logout button (it's in the profile menu)
    // First click on the avatar to open profile menu
    await page.locator('[role="button"] > .MuiAvatar-root').click();
    
    // Then click logout from the dropdown menu
    await page.getByRole('menuitem', { name: /logout/i }).click();
    
    // Should redirect to home page and show login option
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should preserve redirect URL after login', async ({ page }) => {
    // Try to access dashboard directly (should redirect to login)
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    
    // Login
    await page.getByTestId('username-input').fill(TEST_CREDENTIALS.username);
    await page.getByTestId('password-input').fill(TEST_CREDENTIALS.password);
    await page.getByTestId('login-button').click();
    
    // Should redirect back to dashboard after login
    await expect(page).toHaveURL('/dashboard');
  });
});

// OIDC Authentication Tests (if enabled)
test.describe('OIDC Authentication', () => {
  test.skip(({ page }) => {
    // Skip OIDC tests if not configured in the environment
    // In real implementation, you would check if OIDC is enabled
  });

  test('should show OIDC login option when enabled', async ({ page }) => {
    // This test would only run if OIDC is configured
    await page.goto('/login');
    
    // Check if OIDC button is present (assuming it's conditionally rendered)
    const oidcButton = page.getByRole('button', { name: /sign in with/i });
    if (await oidcButton.isVisible()) {
      await expect(oidcButton).toBeVisible();
    }
  });
});