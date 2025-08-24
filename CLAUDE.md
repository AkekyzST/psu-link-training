# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## PSU Link Shortener Application

### Overview

URL shortener application for internal use at Prince of Songkla University with the following core capabilities:

- Authenticated users can create shortened URLs with descriptions and QR codes
- Security level assessment for URLs
- Landing page with URL details, security info, and countdown redirect (3 seconds, stoppable)
- User role-based access control

### User Roles

- **Authenticated Users**: Create/manage links, ownership transfer, statistics
- **Admin Users**: Search, view, and disable any link by shortCode
- **Public Users**: Access links via shortCode

### Key Features

- Time-bound links (startDateTime, endDateTime)
- QR code generation with optional University logo and subtitles
- Cookie consent management

## Project Structure

### Frontend Application (`/cln`)

Single Page Application (SPA) built with:

- **React Router v7** (SSR disabled, SPA mode)
- **MUI v7** for UI components
- **Zustand** for state management
- **react-hook-form** with **zod** for form handling
- **OIDC client** for authentication
- **react-intl** for i18n (Thai/English)

### End-to-End Testing (`/e2e`)

- Playwright test suite
- Assumes dev server running on `http://localhost:5173`

## Development Commands

### Frontend (`/cln`)

```bash
cd cln
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run typecheck    # Type checking with TypeScript
npm run start        # Start production server
```

### E2E Testing (`/e2e`)

```bash
cd e2e
npm install                # Install dependencies
npm run install-browsers   # Install Playwright browsers
npm test                   # Run all tests
npm run test:headed        # Run tests with browser UI
npm run test:ui            # Run tests in UI mode
npm run test:debug         # Debug tests
npm run test:report        # View test report
```

## Architecture & Key Patterns

### Authentication Flow

- **Dual authentication support**: Traditional login and OIDC
- Cookie-based session management with httpOnly cookies
- Automatic token refresh via interceptors
- Web access permission check (`webAllowed` field)

### State Management

- **Zustand stores** with persistence:
  - `auth.ts`: Authentication state, user profile, OIDC handling
  - `toast.ts`: Global notification system
- LocalStorage/SessionStorage fallback for persistence

### API Integration

- Axios with interceptors for auth handling
- Automatic retry with token refresh on 401
- Environment-based configuration via Vite env vars

### Routing

- React Router v7 with file-based routing
- Protected routes via `ProtectedRoute` component
- OIDC callback handling at `/auth/callback`

## Environment Variables

Required in `.env` files:

```bash
VITE_API_URL=<backend API URL>
VITE_OIDC_AUTHORITY=<OIDC provider URL>
VITE_OIDC_CLIENT_ID=<OIDC client identifier>
```

## Key Implementation Files

- `cln/app/stores/auth.ts`: Core authentication logic
- `cln/app/config.ts`: Application configuration
- `cln/app/routes/`: Page components
- `cln/app/components/ProtectedRoute.tsx`: Route protection
- `cln/react-router.config.ts`: React Router configuration (SSR disabled)
