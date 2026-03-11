# Hissaati Marketplace Frontend

Production-style frontend for a social account marketplace platform (buy/sell account listings), built with React, TypeScript, and Vite.

This repository is designed to demonstrate practical frontend engineering for real product workflows: authentication, listing search/filter, seller dashboard, CRUD operations, exchange-rate conversion, and responsive RTL UI.

## Project Snapshot

- Product type: Marketplace web app (single-page application)
- Domain: Social account listing and seller management
- Language and direction: Arabic-first UI with RTL support
- Architecture style: Component-based React app with centralized API and state layers
- Deployment target: Vercel (SPA rewrite configured)

## Core Features

### 1. Marketplace Browsing and Search

- Public listing view with server-side pagination.
- Search by keyword.
- Advanced filters:
  - Category (platform)
  - Country
  - Followers range
  - Price range
- Dynamic filter metadata fetched from backend (countries, categories, max ranges).
- Clear visual filter chips and one-click reset.

### 2. Listing Details

- Dedicated service details page per listing.
- Seller information and listing metadata.
- Price conversion support based on selected country and exchange rates.
- Conditional CTA for seller contact (WhatsApp) when listing is available.

### 3. Authentication and Account Lifecycle

- Register new account.
- OTP verification flow after registration.
- Login with token storage in cookies.
- Forgot-password request form.
- Automatic access token refresh on 401 (queued to avoid duplicate refresh requests).
- Graceful logout and cookie cleanup.

### 4. Seller Profile Dashboard

- Auth-gated profile page.
- View seller profile data and owned announcements.
- Edit profile details (name, description, WhatsApp).
- Change password workflow.
- Delete owned announcements from dashboard.

### 5. Announcement Management (Seller CRUD)

- Create announcement.
- Edit announcement.
- Delete announcement with confirmation modal.
- Form validation and API feedback for all operations.

### 6. Exchange Rates Module

- Fetch and render supported USD-to-local currency pairs.
- Store rates and use them for live price conversion in listing details.

### 7. UX and UI Quality

- Fully responsive layout (desktop + mobile).
- Consistent design system with Tailwind CSS v4 and reusable UI primitives.
- Arabic typography (Cairo) and RTL support.
- Toast-based user feedback with Arabic-friendly message normalization.

## Tech Stack

- Framework: React 19
- Language: TypeScript (strict mode)
- Build tool: Vite 7
- Styling: Tailwind CSS v4 + Flowbite
- State management: Zustand
- Forms: react-hook-form
- Routing: react-router
- Data table: @tanstack/react-table
- Notifications: react-hot-toast
- Cookies/session: react-cookie
- Icons: lucide-react

## Routing Map

| Route                             | Purpose                         |
| --------------------------------- | ------------------------------- |
| `/services`                       | Marketplace listing and search  |
| `/services/:id`                   | Listing details                 |
| `/exchange-rates`                 | Exchange rates view             |
| `/terms`                          | Terms and conditions            |
| `/contact`                        | Contact page                    |
| `/login`                          | Login form                      |
| `/register`                       | Signup form                     |
| `/otp`                            | OTP verification                |
| `/forget-password`                | Password reset request          |
| `/reset-password`                 | New password form (UI in place) |
| `/profile`                        | Seller profile dashboard        |
| `/profile/announcements/new`      | Create new announcement         |
| `/profile/announcements/:id/edit` | Edit existing announcement      |

## API Integration Overview

All requests are routed through a centralized API layer in `src/lib/apiFetch.ts`.

### Public endpoints used

- `GET /` (paginated listing feed with metadata)
- `GET /announcements/search/`
- `GET /announcements/filter/`
- `GET /announcements/:id/`
- `GET /supported-countries/`
- `POST /register/`
- `POST /verify_otp/`
- `POST /login/`
- `POST /reset-password-request/`
- `POST /token/refresh/`

### Authenticated endpoints used

- `GET /seller/announcements/`
- `POST /seller/announcements/`
- `PATCH /seller/announcements/:id/`
- `DELETE /seller/announcements/:id/`
- `PATCH /seller/edit_profile/`
- `POST /change-password/`

## Authentication and Token Strategy

- Access token cookie: `token`
- Refresh token cookie: `refresh_token`
- On `401` responses, API layer triggers a queued refresh flow.
- Refresh requests are deduplicated via a shared promise queue.
- On refresh failure, auth cookies are cleared and user is redirected to `/login`.

This approach prevents race conditions and improves session stability under concurrent requests.

## State Management Design

- `useUserStore` (Zustand + persist): user profile snapshot for UI/session continuity.
- `useMarketplaceMeta` (Zustand): shared countries/categories/max boundaries.
- `useFilters` (Zustand): search and filtering state with normalized ranges.
- `useExchangeRate` (Zustand): rate cache + conversion utility + supported rates content.

## Project Structure

```text
src/
  components/
    AuthComponents/
    ProfileComponents/
    ServicesComponent/
    ServiceDetailsComponents/
    ExchangeRatesComponents/
    ContactComponents/
    TermsComponents/
    PublicComponents/
    ui/
  context/
    UserStore.ts
    FilterContext.tsx
    MarketplaceMetaContext.tsx
    ExchangeRateContext.tsx
  data/
    services.ts
  hooks/
    useMeta.ts
  lib/
    api.ts
    apiFetch.ts
    authCookies.ts
    toast.ts
  pages/
    Services.tsx
    ServiceDetails.tsx
    Profile.tsx
    AnnouncementEditor.tsx
    Login.tsx
    Signup.tsx
    OTP.tsx
    ForgetPassword.tsx
    ResetPassword.tsx
    ExchangeRates.tsx
    Terms.tsx
    Contact.tsx
```

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env` in the project root:

```bash
VITE_BACKEND_URL=https://your-backend-api-url
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

### 6. Lint

```bash
npm run lint
```

## Deployment

This project is configured for Vercel SPA deployments via `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This ensures client-side routes work correctly when opened directly.

## Engineering Highlights

- Strong TypeScript setup with strict checks.
- Clean API abstraction (`apiFetch`, `apiFetchJson`, `safeParseJson`).
- Defensive error handling with localized UI feedback.
- Reusable component composition for profile and announcement editor modules.
- SEO-friendly page-level metadata updates through a custom `useMeta` hook.

## Current Status and Next Improvements

- Reset password final submit is currently a UI-level flow and can be connected to backend reset confirmation endpoint.
- Add automated tests (unit + integration) for auth flows, filter logic, and form validation.
- Add analytics/tracking and observability for product metrics.
- Add role-based access enhancements if admin/moderation is required.

## CV-Ready Summary

If you want to reference this project in a CV, you can summarize it as:

> Built a production-style React + TypeScript marketplace frontend with secure JWT auth (refresh queue), advanced multi-criteria filtering, seller dashboard CRUD, exchange-rate conversion, and responsive Arabic RTL UX, deployed-ready on Vercel.
