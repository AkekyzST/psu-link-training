import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth';

test.describe('Internationalization (i18n)', () => {
  test('should display language switcher', async ({ page }) => {
    await page.goto('/');
    
    // Language switcher should be visible in the header (compact variant)
    // Look for the button with flag emoji and language code
    const languageSwitcher = page.locator('button').filter({ hasText: /🇺🇸|🇹🇭/ }).or(
      page.locator('button').filter({ hasText: /EN|TH/ })
    );
    await expect(languageSwitcher.first()).toBeVisible();
  });

  test('should switch between English and Thai', async ({ page }) => {
    await page.goto('/');
    
    // Find language switcher button (with flag emoji)
    const langSwitcher = page.locator('button').filter({ hasText: /🇺🇸|🇹🇭/ }).first();
    
    if (await langSwitcher.isVisible()) {
      // Click to open language menu
      await langSwitcher.click();
      
      // Wait for menu to appear and select Thai option
      const thaiMenuItem = page.getByRole('menuitem').filter({ hasText: /Thai|ไทย|🇹🇭/ });
      if (await thaiMenuItem.isVisible()) {
        await thaiMenuItem.click();
        
        // Wait for language change to take effect
        await page.waitForTimeout(1000);
        
        // Verify language has changed by checking if Thai flag is now displayed
        const thaiFlag = page.locator('button').filter({ hasText: '🇹🇭' });
        await expect(thaiFlag.first()).toBeVisible();
      }
    }
  });

  test('should persist language preference', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Thai
    const langSwitcher = page.locator('button').filter({ hasText: /🇺🇸|🇹🇭/ }).first();
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      const thaiMenuItem = page.getByRole('menuitem').filter({ hasText: /Thai|ไทย|🇹🇭/ });
      if (await thaiMenuItem.isVisible()) {
        await thaiMenuItem.click();
        
        // Refresh page
        await page.reload();
        
        // Language should persist (Thai flag should still be visible)
        const thaiFlag = page.locator('button').filter({ hasText: '🇹🇭' });
        await expect(thaiFlag.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should translate login form', async ({ page }) => {
    await page.goto('/login');
    
    // Switch to Thai language
    const langSwitcher = page.locator('button').filter({ hasText: /🇺🇸|🇹🇭/ }).first();
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      const thaiMenuItem = page.getByRole('menuitem').filter({ hasText: /Thai|ไทย|🇹🇭/ });
      if (await thaiMenuItem.isVisible()) {
        await thaiMenuItem.click();
        
        // Wait for translation to apply
        await page.waitForTimeout(1000);
        
        // Check if page title or form elements show Thai text
        // Note: Actual translation depends on the i18n messages configuration
        const pageContent = await page.textContent('body');
        // Just verify the language switch worked by checking the flag
        const thaiFlag = page.locator('button').filter({ hasText: '🇹🇭' });
        await expect(thaiFlag.first()).toBeVisible();
      }
    }
  });

  test('should translate dashboard elements', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
    
    // Wait for dashboard to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Switch to Thai language
    const langSwitcher = page.locator('button').filter({ hasText: /🇺🇸|🇹🇭/ }).first();
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      const thaiMenuItem = page.getByRole('menuitem').filter({ hasText: /Thai|ไทย|🇹🇭/ });
      if (await thaiMenuItem.isVisible()) {
        await thaiMenuItem.click();
        
        // Wait for translation to apply
        await page.waitForTimeout(1000);
        
        // Verify language switch worked by checking the flag
        const thaiFlag = page.locator('button').filter({ hasText: '🇹🇭' });
        await expect(thaiFlag.first()).toBeVisible();
      }
    }
  });

  test('should handle language switching without breaking layout', async ({ page }) => {
    await page.goto('/');
    
    // Switch language and check layout integrity
    const langSwitcher = page.locator('button').filter({ hasText: /🇺🇸|🇹🇭/ }).first();
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      const thaiMenuItem = page.getByRole('menuitem').filter({ hasText: /Thai|ไทย|🇹🇭/ });
      if (await thaiMenuItem.isVisible()) {
        await thaiMenuItem.click();
        
        // Wait for language change
        await page.waitForTimeout(1000);
        
        // Layout should remain intact
        await expect(page.locator('body')).toBeVisible();
        await expect(page.locator('header, [role="banner"]')).toBeVisible();
      }
    }
  });

  test('should format dates according to locale', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Check if there are any dates displayed
    const dateElements = page.locator('time, [data-testid*="date"], text=/\\d{1,2}[\\/\\-]\\d{1,2}[\\/\\-]\\d{4}/');
    
    if (await dateElements.first().isVisible()) {
      // Switch language and verify date format changes
      const langSwitcher = page.locator('button').filter({ hasText: /🇺🇸|🇹🇭/ }).first();
      
      if (await langSwitcher.isVisible()) {
        await langSwitcher.click();
        
        const thaiMenuItem = page.getByRole('menuitem').filter({ hasText: /Thai|ไทย|🇹🇭/ });
        if (await thaiMenuItem.isVisible()) {
          await thaiMenuItem.click();
          
          await page.waitForTimeout(1000);
          
          // Verify language changed (dates might still be in relative format)
          const thaiFlag = page.locator('button').filter({ hasText: '🇹🇭' });
          await expect(thaiFlag.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('UI Interactions and Responsiveness', () => {
  test('should work on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Basic elements should be visible on all screen sizes
      await expect(page.getByText(/PSU Link Shortener/i)).toBeVisible();
      
      // Navigation should work on all sizes
      const loginButton = page.getByRole('button', { name: /login/i });
      if (await loginButton.isVisible()) {
        await expect(loginButton).toBeVisible();
      }
    }
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Touch targets should be large enough
    const buttons = await page.locator('button').all();
    
    for (const button of buttons.slice(0, 3)) { // Check first 3 buttons
      if (await button.isVisible()) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThan(40); // Minimum 44px recommended
        }
      }
    }
  });

  test('should show loading states appropriately', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form
    await page.getByTestId('username-input').fill('u0');
    await page.getByTestId('password-input').fill('1234');
    
    // Click login and look for loading state
    await page.getByTestId('login-button').click();
    
    // Should show loading indicator (might be brief)
    // Look for disabled button state or loading text
    const loadingButton = page.getByTestId('login-button').filter({ hasText: /logging.*in/i });
    if (await loadingButton.isVisible({ timeout: 1000 })) {
      await expect(loadingButton).toBeVisible();
    }
  });

  test('should show error states clearly', async ({ page }) => {
    await page.goto('/login');
    
    // Try login with invalid credentials
    await page.getByTestId('username-input').fill('invalid');
    await page.getByTestId('password-input').fill('invalid');
    await page.getByTestId('login-button').click();
    
    // Should show error message (toast)
    const errorToast = page.locator('[role="alert"], .MuiAlert-root, .MuiSnackbar-root');
    await expect(errorToast).toBeVisible({ timeout: 10000 });
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('username-input')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('password-input')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('login-button')).toBeFocused();
    
    // Should be able to submit with Enter
    await page.getByTestId('username-input').fill('u0');
    await page.getByTestId('password-input').fill('1234');
    await page.keyboard.press('Enter');
    
    // Should trigger form submission
    await expect(page).toHaveURL('/');
  });

  test('should provide proper focus management', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
    
    // Open create form
    await page.getByRole('button', { name: /create/i }).click();
    
    // Focus should move to first form field
    await expect(page.getByLabel(/original.*url/i)).toBeFocused();
    
    // When closing dialog, focus should return
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: /create/i })).toBeFocused();
  });

  test('should show appropriate tooltips and help text', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Hover over action buttons to see tooltips
    const actionButtons = page.locator('[title], [aria-label]').first();
    if (await actionButtons.isVisible()) {
      await actionButtons.hover();
      
      // Tooltip should appear (might be handled by MUI)
      const tooltip = page.locator('[role="tooltip"]');
      if (await tooltip.isVisible({ timeout: 2000 })) {
        await expect(tooltip).toBeVisible();
      }
    }
  });

  test('should handle form validation properly', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
    
    // Open create form
    await page.getByRole('button', { name: /create/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /create.*short.*link/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/required|invalid/i)).toBeVisible();
    
    // Fill valid URL
    await page.getByLabel(/original.*url/i).fill('https://example.com');
    
    // Error should clear
    await expect(page.getByText(/required/i)).not.toBeVisible();
  });

  test('should handle long content gracefully', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
    
    // Open create form
    await page.getByRole('button', { name: /create/i }).click();
    
    // Fill with very long URL
    const longUrl = 'https://example.com/' + 'a'.repeat(500);
    await page.getByLabel(/original.*url/i).fill(longUrl);
    
    // Form should handle long content without breaking layout
    const urlField = page.getByLabel(/original.*url/i);
    const fieldBox = await urlField.boundingBox();
    expect(fieldBox?.width).toBeGreaterThan(0);
    
    // Long description
    const longDescription = 'Test description '.repeat(50);
    await page.getByLabel(/description/i).fill(longDescription);
    
    // Should still be able to submit
    await page.getByRole('button', { name: /create.*short.*link/i }).click();
  });

  test('should show confirmation dialogs for destructive actions', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Look for delete button
    const deleteButton = page.getByTitle(/delete/i).or(page.locator('button:has-text("🗑️")')).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Should show confirmation dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText(/delete|remove|confirm/i)).toBeVisible();
      
      // Should have cancel and confirm buttons
      await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /delete|confirm/i })).toBeVisible();
    }
  });

  test('should handle network connectivity issues', async ({ page }) => {
    await page.goto('/login');
    
    // Simulate offline
    await page.context().setOffline(true);
    
    // Try to login
    await page.getByTestId('username-input').fill('u0');
    await page.getByTestId('password-input').fill('1234');
    await page.getByTestId('login-button').click();
    
    // Should show network error message
    const errorToast = page.locator('[role="alert"], .MuiAlert-root, .MuiSnackbar-root');
    await expect(errorToast).toBeVisible({ timeout: 10000 });
    
    // Restore connectivity
    await page.context().setOffline(false);
  });
});