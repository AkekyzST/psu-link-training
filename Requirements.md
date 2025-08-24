# Requirements

I want to implement the URL Shortener for in-house using. We already have API for backend for CRUD operation.

Input: a URL link
Output: Shorten link and QR Code

API Spec is at C:\Users\Ekaphon\source\repos\psu-link-training\API-spec.json

User able to proceed shortening link after authenticated only.

## Implementation Plan

### Phase 1: Core Link Management (Priority 1)

1. **Create Link Management Store** (`cln/app/stores/links.ts`)
   - Zustand store for link state management
   - CRUD operations (create, read, update, delete)
   - API integration with error handling
   - Pagination and sorting support

2. **Build Link Creation Form** (`cln/app/components/LinkCreateForm.tsx`)
   - URL input with validation
   - Description field
   - Date range picker (startDateTime, endDateTime)
   - QR code options (withLogo, qrSubtitle)
   - Form validation with zod schema
   - Success/error feedback

3. **Implement Link Dashboard** (`cln/app/routes/dashboard.tsx`)
   - DataGrid table showing user's links
   - Columns: Short code, URL, description, status, access count, actions
   - Edit, delete, view stats, copy link actions
   - Pagination controls
   - Search/filter functionality

4. **Add Link Editing** (`cln/app/components/LinkEditDialog.tsx`)
   - Modal dialog for editing existing links
   - Pre-populate form with existing data
   - Update API integration
   - Real-time validation

5. **Integrate QR Code Generation** (`cln/app/components/QRCodeGenerator.tsx`)
   - Use qrcode.js or react-qr-code library
   - Support PSU logo overlay
   - Subtitle text support
   - Download QR as image
   - Copy QR to clipboard

### Phase 2: Public Access Features (Priority 2)

6. **Build Landing Page** (`cln/app/routes/$shortCode.tsx`)
   - Public route (no auth required)
   - Display: original URL, description, page title
   - Security level indicator (safe/moderate/risky/dangerous)
   - 3-second countdown with stop button
   - Last security update timestamp
   - Access count display

7. **Add Direct Redirect Handler** (`cln/app/routes/r/$shortCode.tsx`)
   - Immediate redirect without landing page
   - Increment access counter
   - Check link validity (enabled, date range)

8. **Create Link Statistics Views** (`cln/app/components/LinkStats.tsx`)
   - Access count over time chart
   - Total clicks, unique visitors
   - Referrer information
   - Device/browser breakdown
   - Export stats as CSV

### Phase 3: Admin Features (Priority 3)
9. **Admin Dashboard** (`cln/app/routes/admin/links.tsx`)
   - Protected route (admin only)
   - Search all links across users
   - Advanced filters (user, date, status)
   - Bulk actions support

10. **Admin Link Controls** (`cln/app/components/AdminLinkActions.tsx`)
    - Disable/enable any link
    - View link details by shortCode
    - User information display
    - Audit log of changes

11. **Ownership Transfer** (`cln/app/components/TransferOwnershipDialog.tsx`)
    - User search/selection
    - Confirmation dialog
    - Email notification (if available)

### Phase 4: Enhancement Features (Priority 4)
12. **Security Level Display** (`cln/app/components/SecurityBadge.tsx`)
    - Color-coded badges (green/yellow/orange/red)
    - Tooltip explanations
    - Icon indicators
    - Accessibility support

13. **Cookie Consent** (`cln/app/components/CookieConsent.tsx`)
    - GDPR compliance banner
    - Preference management
    - Local storage for user choice
    - Integration with analytics

14. **Advanced QR Options** (`cln/app/components/QRCustomizer.tsx`)
    - Color customization
    - Error correction level
    - Size options
    - Frame styles

15. **Bulk Operations** (`cln/app/components/BulkActions.tsx`)
    - Multi-select in data grid
    - Bulk delete, enable/disable
    - Bulk export
    - Bulk QR generation

## Technical Implementation Details

### API Integration Pattern
```typescript
// Use existing axios client from auth store
// Add new endpoints to link store
// Follow error handling patterns from auth.ts
```

### Component Structure
- Follow existing MUI v7 patterns
- Use react-hook-form for forms
- Implement zod schemas for validation
- Add i18n support for all new strings

### State Management
- Create new Zustand store for links
- Use optimistic updates for better UX
- Implement proper loading states
- Cache link data appropriately

### Routing
- Add new routes to routes.ts
- Implement proper route guards
- Handle 404 for invalid short codes
- SEO meta tags for public pages

### Testing Approach
- Add Playwright tests for critical flows
- Test link creation, editing, deletion
- Test public access and redirects
- Test admin functionality

## Dependencies to Add
```json
{
  "qrcode": "^1.5.3",
  "react-qr-code": "^2.0.12",
  "dayjs": "^1.11.10",
  "file-saver": "^2.0.5"
}
```

## Environment Variables
```
VITE_APP_BASE_URL=http://localhost:5173  # For generating short links
VITE_QR_LOGO_URL=/psu-logo.png          # PSU logo for QR codes
```

## Estimated Timeline
- Phase 1: 2-3 days (Core functionality)
- Phase 2: 1-2 days (Public features)
- Phase 3: 2 days (Admin features)
- Phase 4: 2 days (Enhancements)

Total: 7-9 days for complete implementation