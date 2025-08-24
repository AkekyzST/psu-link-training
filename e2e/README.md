# PSU Link Shortener E2E Tests

End-to-end tests for the PSU Link Shortener application using Playwright.

## Test Structure

### Test Files

- `login.spec.ts` - Authentication and login flow tests
- `dashboard.spec.ts` - Dashboard and link management tests
- `public-links.spec.ts` - Public link access and landing page tests
- `i18n-ui.spec.ts` - Internationalization and UI interaction tests

### Helper Files

- `helpers/auth.ts` - Authentication helper functions
- `helpers/test-data.ts` - Test data constants and utilities

## Test Coverage

### Authentication Tests
- Login form validation
- Successful login with valid credentials
- Error handling for invalid credentials
- Logout functionality
- Protected route redirection
- OIDC authentication (when configured)

### Dashboard & Link Management Tests
- Create new links with various options
- Edit existing links
- Delete links with confirmation
- Search and filter functionality
- QR code generation
- Link statistics
- Pagination and data grid interactions


### Public Link Access Tests
- Active link landing pages
- Countdown timer functionality
- Security level warnings
- Expired/inactive link handling
- Scheduled link behavior
- 404 error pages
- Mobile responsiveness
- QR code display

### UI & Internationalization Tests
- Language switching (EN/TH)
- Language preference persistence
- Responsive design across devices
- Touch interaction support
- Keyboard navigation
- Loading states
- Error states
- Form validation
- Accessibility features

## Configuration

The tests are configured to:
- Run against `http://localhost:5173` (development server)
- Start the cln development server automatically
- Take screenshots on failure
- Record videos on failure
- Generate HTML reports

## Environment Variables

Configure these environment variables for your test environment:

```bash
TEST_USERNAME=u0
TEST_PASSWORD=1234
TEST_ACTIVE_SHORTCODE=test123
TEST_EXPIRED_SHORTCODE=expired123
TEST_INACTIVE_SHORTCODE=inactive123
TEST_SCHEDULED_SHORTCODE=scheduled123
TEST_RISKY_SHORTCODE=risky123
```

## Running Tests

### Install Dependencies
```bash
npm install
npm run install-browsers
```

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Debug Tests
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test login.spec.ts
```

### Run Tests with Specific Tag
```bash
npx playwright test --grep "authentication"
```

## Test Data Requirements

For comprehensive test coverage, ensure your test environment has:

1. **User Accounts:**
   - Regular user account (username: u0, or set TEST_USERNAME)

2. **Test Links:**
   - Active link with short code (default: test123)
   - Expired link with short code (default: expired123)
   - Inactive/disabled link with short code (default: inactive123)
   - Scheduled link with future start date (default: scheduled123)
   - Link with risky security level (default: risky123)

3. **Backend API:**
   - Running backend API server
   - Test database with appropriate seed data
   - All endpoints functioning correctly

## Best Practices

### Writing New Tests
1. Use descriptive test names that explain the behavior being tested
2. Group related tests using `test.describe()`
3. Use helper functions for common operations (login, logout, etc.)
4. Add appropriate timeouts for async operations
5. Clean up test data when necessary
6. Use data-testid attributes for reliable element selection

### Page Object Pattern
Consider implementing page objects for complex pages:

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async login(username: string, password: string) {
    await this.page.getByTestId('username-input').fill(username);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('login-button').click();
  }
}
```

### Test Isolation
- Each test should be independent and not rely on other tests
- Use `test.beforeEach()` for common setup
- Clean up created data in `test.afterEach()` if needed
- Use test-specific data to avoid conflicts

## Debugging

### Debug Mode
Run tests in debug mode to step through test execution:
```bash
npm run test:debug
```

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots at the point of failure
- Video recordings of the entire test run

These are saved in the `test-results/` directory.

### Trace Viewer
Use Playwright's trace viewer for detailed debugging:
```bash
npx playwright show-trace test-results/trace.zip
```

### Console Logs
Add console output in tests for debugging:
```typescript
console.log('Current URL:', page.url());
console.log('Page title:', await page.title());
```

## Continuous Integration

For CI/CD pipelines:

1. **Install Dependencies:**
```bash
npm ci
npx playwright install --with-deps
```

2. **Run Tests:**
```bash
npm test
```

3. **Upload Artifacts:**
Configure your CI to upload test-results/ directory as artifacts for failed builds.

### GitHub Actions Example
```yaml
- name: Run Playwright tests
  run: npm test
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Known Issues and Limitations

1. **External URL Testing:** Tests avoid actually visiting external URLs to prevent flaky tests
2. **Email Testing:** Email functionality tests may require mock email services
3. **File Upload:** File upload tests may need special handling for different browsers
4. **Time-Dependent Tests:** Tests with countdown timers may be flaky in slow CI environments

## Contributing

When adding new tests:
1. Follow the existing test structure and naming conventions
2. Add appropriate test data constants to `helpers/test-data.ts`
3. Update this README if adding new test categories
4. Ensure tests pass in both local and CI environments