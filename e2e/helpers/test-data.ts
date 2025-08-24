/**
 * Test data constants used across test files
 */

export const TEST_LINKS = {
  valid: {
    url: 'https://example.com/test-page',
    description: 'Test link for E2E testing'
  },
  withQR: {
    url: 'https://example.com/qr-test',
    description: 'Test link with QR code',
    qrSubtitle: 'PSU Link Shortener'
  },
  scheduled: {
    url: 'https://example.com/scheduled',
    description: 'Scheduled test link',
    startDateTime: '2024-12-31T00:00:00',
    endDateTime: '2025-12-31T23:59:59'
  },
  long: {
    url: 'https://example.com/very-long-url-with-many-parameters?param1=value1&param2=value2&param3=value3&param4=value4',
    description: 'Test link with very long URL and description that spans multiple lines to test text overflow handling'
  }
};

export const INVALID_LINKS = {
  notUrl: 'not-a-url',
  emptyUrl: '',
  malformed: 'htp://invalid-url'
};

export const TEST_SHORT_CODES = {
  active: process.env.TEST_ACTIVE_SHORTCODE || 'test123',
  expired: process.env.TEST_EXPIRED_SHORTCODE || 'expired123',
  inactive: process.env.TEST_INACTIVE_SHORTCODE || 'inactive123',
  scheduled: process.env.TEST_SCHEDULED_SHORTCODE || 'scheduled123',
  risky: process.env.TEST_RISKY_SHORTCODE || 'risky123',
  nonexistent: 'definitely-does-not-exist-123'
};

export const TEST_USERS = {
  regular: {
    id: 1,
    username: 'testuser',
    displayName: 'Test User'
  }
};

export const SECURITY_LEVELS = ['safe', 'moderate', 'risky', 'dangerous'] as const;

export const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1440 }
};

/**
 * Generate test link data with optional overrides
 */
export function generateTestLink(overrides: Partial<typeof TEST_LINKS.valid> = {}) {
  return {
    ...TEST_LINKS.valid,
    ...overrides,
    // Add timestamp to make URLs unique
    url: `${overrides.url || TEST_LINKS.valid.url}?t=${Date.now()}`
  };
}

/**
 * Common assertions for link objects
 */
export const LINK_ASSERTIONS = {
  hasRequiredFields: ['id', 'shortCode', 'originalUrl', 'enabled', 'securityLevel', 'accessCount', 'createdAt'],
  securityLevels: SECURITY_LEVELS
};