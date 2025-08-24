# PSU Link Shortener - Implementation Tasks

## Setup & Dependencies
- [ ] Install required npm packages (`qrcode`, `react-qr-code`, `dayjs`, `file-saver`)
- [ ] Add environment variables (`VITE_APP_BASE_URL`, `VITE_QR_LOGO_URL`)
- [ ] Add PSU logo image to public folder for QR codes

## Phase 1: Core Link Management (Priority 1)

### 1. Create Link Management Store (`cln/app/stores/links.ts`)
- [ ] Create Zustand store structure
- [ ] Implement state interface for links
- [ ] Add CRUD operation methods
- [ ] Integrate API endpoints from spec
- [ ] Add error handling
- [ ] Implement pagination support
- [ ] Add sorting functionality
- [ ] Create loading states

### 2. Build Link Creation Form (`cln/app/components/LinkCreateForm.tsx`)
- [ ] Create form component structure
- [ ] Add URL input field with validation
- [ ] Add description textarea
- [ ] Implement date range picker (startDateTime, endDateTime)
- [ ] Add QR code options (withLogo checkbox, qrSubtitle input)
- [ ] Create zod validation schema
- [ ] Integrate with link store
- [ ] Add success notification
- [ ] Add error handling and display

### 3. Implement Link Dashboard (`cln/app/routes/dashboard.tsx`)
- [ ] Create dashboard route
- [ ] Add MUI DataGrid component
- [ ] Configure columns (shortCode, URL, description, status, accessCount)
- [ ] Add action buttons (edit, delete, stats, copy)
- [ ] Implement pagination controls
- [ ] Add search functionality
- [ ] Add filter options
- [ ] Integrate with link store
- [ ] Add loading states

### 4. Add Link Editing (`cln/app/components/LinkEditDialog.tsx`)
- [ ] Create modal dialog component
- [ ] Add form fields matching create form
- [ ] Implement pre-population with existing data
- [ ] Add update API integration
- [ ] Add real-time validation
- [ ] Add confirmation on save
- [ ] Handle success/error states

### 5. Integrate QR Code Generation (`cln/app/components/QRCodeGenerator.tsx`)
- [ ] Install and configure QR code library
- [ ] Create QR code component
- [ ] Add PSU logo overlay support
- [ ] Implement subtitle text
- [ ] Add download as PNG functionality
- [ ] Add copy to clipboard feature
- [ ] Create size options
- [ ] Add error correction levels

## Phase 2: Public Access Features (Priority 2)

### 6. Build Landing Page (`cln/app/routes/$shortCode.tsx`)
- [ ] Create dynamic route for shortCode
- [ ] Remove authentication requirement
- [ ] Display original URL
- [ ] Show description and page title
- [ ] Add security level indicator
- [ ] Implement 3-second countdown timer
- [ ] Add stop redirect button
- [ ] Display last security update timestamp
- [ ] Show access count
- [ ] Add meta tags for SEO

### 7. Add Direct Redirect Handler (`cln/app/routes/r/$shortCode.tsx`)
- [ ] Create redirect route
- [ ] Implement immediate redirect logic
- [ ] Add access counter increment
- [ ] Check link enabled status
- [ ] Validate date range (startDateTime, endDateTime)
- [ ] Handle invalid/expired links
- [ ] Add 404 page for missing links

### 8. Create Link Statistics Views (`cln/app/components/LinkStats.tsx`)
- [ ] Create statistics component
- [ ] Add MUI Charts for access over time
- [ ] Display total clicks counter
- [ ] Show unique visitors (if available)
- [ ] Add referrer information table
- [ ] Show device/browser breakdown
- [ ] Implement CSV export functionality
- [ ] Add date range filter

## Phase 3: Admin Features (Priority 3)

### 9. Admin Dashboard (`cln/app/routes/admin/links.tsx`)
- [ ] Create admin-only route
- [ ] Add route protection for admin users
- [ ] Implement search across all links
- [ ] Add user filter dropdown
- [ ] Add date range filter
- [ ] Add status filter (active/inactive)
- [ ] Implement bulk selection
- [ ] Add export functionality

### 10. Admin Link Controls (`cln/app/components/AdminLinkActions.tsx`)
- [ ] Create admin actions component
- [ ] Add disable/enable toggle
- [ ] Implement view by shortCode search
- [ ] Display owner information
- [ ] Add audit log display (if available)
- [ ] Create confirmation dialogs
- [ ] Add success/error notifications

### 11. Ownership Transfer (`cln/app/components/TransferOwnershipDialog.tsx`)
- [ ] Create transfer dialog component
- [ ] Add user search/autocomplete
- [ ] Display current owner info
- [ ] Add confirmation step
- [ ] Implement transfer API call
- [ ] Add success notification
- [ ] Handle error cases

## Phase 4: Enhancement Features (Priority 4)

### 12. Security Level Display (`cln/app/components/SecurityBadge.tsx`)
- [ ] Create badge component
- [ ] Add color coding (green/yellow/orange/red)
- [ ] Create security icons
- [ ] Add tooltip with explanations
- [ ] Ensure accessibility (ARIA labels)
- [ ] Add to link tables and landing page

### 13. Cookie Consent (`cln/app/components/CookieConsent.tsx`)
- [ ] Create consent banner component
- [ ] Add accept/reject buttons
- [ ] Implement preference management
- [ ] Store choice in localStorage
- [ ] Add cookie policy link
- [ ] Integrate with app root
- [ ] Style with MUI theme

### 14. Advanced QR Options (`cln/app/components/QRCustomizer.tsx`)
- [ ] Add color picker for QR codes
- [ ] Implement error correction level selector
- [ ] Add size slider/options
- [ ] Create frame style options
- [ ] Add preview functionality
- [ ] Update QR generator integration

### 15. Bulk Operations (`cln/app/components/BulkActions.tsx`)
- [ ] Add checkbox column to DataGrid
- [ ] Implement select all functionality
- [ ] Add bulk delete action
- [ ] Add bulk enable/disable
- [ ] Implement bulk export
- [ ] Add bulk QR generation
- [ ] Create progress indicator
- [ ] Add confirmation dialogs

## Testing

### Unit Tests
- [ ] Test link store methods
- [ ] Test form validations
- [ ] Test utility functions

### E2E Tests (Playwright)
- [ ] Test link creation flow
- [ ] Test link editing
- [ ] Test link deletion
- [ ] Test public access page
- [ ] Test redirect functionality
- [ ] Test admin features
- [ ] Test authentication flows

## Internationalization
- [ ] Add English translations for all new strings
- [ ] Add Thai translations for all new strings
- [ ] Test language switching

## Documentation
- [ ] Update CLAUDE.md with new features
- [ ] Add API integration examples
- [ ] Document component usage
- [ ] Create user guide

## Performance & Optimization
- [ ] Implement link data caching
- [ ] Add lazy loading for large lists
- [ ] Optimize QR code generation
- [ ] Add image optimization for logos

## Final Steps
- [ ] Code review
- [ ] Security audit
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Deployment preparation