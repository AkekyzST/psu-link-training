import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth';

const TEST_LINK = {
  url: 'https://example.com/test-url',
  description: 'Test link for e2e testing'
};

test.describe('Dashboard and Link Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  test('should navigate to dashboard from home page', async ({ page }) => {
    // Should be on home page after login
    await expect(page).toHaveURL('/');
    
    // Click dashboard button
    await page.getByRole('button', { name: /dashboard/i }).click();
    
    // Should navigate to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify dashboard elements are present
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible();
  });

  test('should display user links in dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for the page to load and data grid to appear
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Check if there are columns headers
    await expect(page.getByRole('columnheader', { name: /short.*code/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /url/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /description/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('should open create link form', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click create new link button
    await page.getByRole('button', { name: /create/i }).click();
    
    // Verify create form modal/dialog is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/create.*link/i)).toBeVisible();
    
    // Verify form fields are present
    await expect(page.getByLabel(/original.*url/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
  });

  test('should create a new link successfully', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open create form
    await page.getByRole('button', { name: /create/i }).click();
    
    // Fill form
    await page.getByLabel(/original.*url/i).fill(TEST_LINK.url);
    await page.getByLabel(/description/i).fill(TEST_LINK.description);
    
    // Submit form
    await page.getByRole('button', { name: /create.*short.*link/i }).click();
    
    // Should see success message (toast)
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
    
    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
    
    // Should see the new link in the grid
    await expect(page.getByText(TEST_LINK.description)).toBeVisible({ timeout: 10000 });
  });

  test('should show validation errors for invalid URL', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open create form
    await page.getByRole('button', { name: /create/i }).click();
    
    // Fill with invalid URL
    await page.getByLabel(/original.*url/i).fill('not-a-valid-url');
    
    // Try to submit
    await page.getByRole('button', { name: /create.*short.*link/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/valid.*url/i)).toBeVisible();
  });

  test('should show advanced options in create form', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open create form
    await page.getByRole('button', { name: /create/i }).click();
    
    // Click show advanced options
    await page.getByRole('button', { name: /advanced.*options/i }).click();
    
    // Should show time-based access options
    await expect(page.getByText(/time.*based.*access/i)).toBeVisible();
    await expect(page.getByLabel(/start.*date/i)).toBeVisible();
    await expect(page.getByLabel(/end.*date/i)).toBeVisible();
    
    // Should show QR code customization
    await expect(page.getByText(/qr.*code/i)).toBeVisible();
  });

  test('should create link with QR code options', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open create form
    await page.getByRole('button', { name: /create/i }).click();
    
    // Fill basic info
    await page.getByLabel(/original.*url/i).fill(TEST_LINK.url);
    await page.getByLabel(/description/i).fill(TEST_LINK.description + ' with QR');
    
    // Show advanced options
    await page.getByRole('button', { name: /advanced.*options/i }).click();
    
    // Show QR options
    await page.getByRole('button', { name: /show/i }).first().click();
    
    // Enable PSU logo
    await page.getByRole('checkbox', { name: /psu.*logo/i }).check();
    
    // Add QR subtitle
    await page.getByLabel(/qr.*subtitle/i).fill('Test QR Subtitle');
    
    // Submit
    await page.getByRole('button', { name: /create.*short.*link/i }).click();
    
    // Should see success message
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('should search links in dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Use search field
    const searchField = page.getByPlaceholder(/search/i);
    await expect(searchField).toBeVisible();
    
    await searchField.fill('test');
    
    // Results should filter (this assumes there are links to filter)
    await page.waitForTimeout(1000); // Wait for search to process
  });

  test('should copy link to clipboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Look for copy button (clipboard icon) - might be represented by emoji or icon
    const copyButton = page.getByTitle(/copy/i).or(page.locator('button:has-text("📋")')).first();
    if (await copyButton.isVisible()) {
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      await copyButton.click();
      
      // Should show success toast
      const successToast = page.locator('[role="alert"], .MuiAlert-root, .MuiSnackbar-root');
      await expect(successToast).toBeVisible({ timeout: 10000 });
    }
  });

  test('should open QR code dialog', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Look for QR button (might be represented by "QR" text)
    const qrButton = page.getByTitle(/qr/i).or(page.locator('button:has-text("QR")')).first();
    if (await qrButton.isVisible()) {
      await qrButton.click();
      
      // Should open QR dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText(/qr.*code/i)).toBeVisible();
    }
  });

  test('should open edit dialog and update link', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Look for edit button (might be represented by emoji)
    const editButton = page.getByTitle(/edit/i).or(page.locator('button:has-text("✏️")')).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Should open edit dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      
      // Update description
      const descField = page.getByLabel(/description/i);
      await descField.clear();
      await descField.fill('Updated description');
      
      // Save changes
      await page.getByRole('button', { name: /save/i }).click();
      
      // Should see success message
      const successToast = page.locator('[role="alert"], .MuiAlert-root, .MuiSnackbar-root');
      await expect(successToast).toBeVisible({ timeout: 10000 });
    }
  });

  test('should delete link with confirmation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Look for delete button (might be represented by emoji)
    const deleteButton = page.getByTitle(/delete/i).or(page.locator('button:has-text("🗑️")')).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Should show confirmation dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText(/delete/i)).toBeVisible();
      
      // Cancel first
      await page.getByRole('button', { name: /cancel/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // Try delete again and confirm
      await deleteButton.click();
      await page.getByRole('button', { name: /delete/i }).click();
      
      // Should see success message
      const successToast = page.locator('[role="alert"], .MuiAlert-root, .MuiSnackbar-root');
      await expect(successToast).toBeVisible({ timeout: 10000 });
    }
  });

  test('should navigate to link stats', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Look for stats button (might be represented by emoji)
    const statsButton = page.getByTitle(/stats/i).or(page.locator('button:has-text("📊")')).first();
    if (await statsButton.isVisible()) {
      await statsButton.click();
      
      // Should navigate to stats page
      await expect(page.url()).toContain('/stats');
    }
  });

  test('should handle pagination', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for grid to load
    await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 });
    
    // Look for pagination controls
    const paginationInfo = page.locator('[role="grid"]').locator('text=/\\d+-\\d+ of \\d+/');
    if (await paginationInfo.isVisible()) {
      // Pagination is present, test page size selector
      const pageSizeSelector = page.locator('[role="combobox"]').filter({ hasText: /rows per page/i });
      if (await pageSizeSelector.isVisible()) {
        await pageSizeSelector.click();
        
        // Select different page size
        await page.getByRole('option', { name: '25' }).click();
        
        // Grid should reload with new page size
        await page.waitForTimeout(1000);
      }
    }
  });
});