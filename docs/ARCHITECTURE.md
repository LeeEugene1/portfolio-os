# Architecture

## Overview

```txt
Flutter App
  └─ WebView / WKWebView
      └─ Vercel deployed responsive web
          └─ React / Next.js App
```

## Monorepo Structure

```txt
apps/
  web/            Next.js responsive web app
  mobile-shell/   Flutter WebView APK shell

docs/
  PRD.md
  ARCHITECTURE.md
  TEST_PLAN.md
  ORCHESTRATION.md
  plans/
```

## Responsibilities

### apps/web

- Owns all portfolio UI and interactions.
- Handles desktop and mobile responsive layouts.
- Stores guest cart data in localStorage for MVP.
- Deploys to Vercel.

### apps/mobile-shell

- Loads the Vercel production URL in a WebView.
- Handles Android back button behavior.
- Handles loading and error states.
- Builds Android APK.

## Recommended Web Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Radix UI or shadcn/ui
- lucide-react
- Zustand
- Vitest
- React Testing Library
- Playwright

## State Model

Core client state:

- Open windows
- Focused window
- Window position and size
- Guest cart items
- Calculator state

## Cart Strategy

MVP cart storage:

- Static product data.
- localStorage guest cart.
- No login.
- No backend API.

Future cart storage:

- Guest session API.
- Database-backed cart.
- Optional login migration.

## Deployment

- Vercel project root: `apps/web`
- Flutter WebView URL: Vercel production URL
- APK build root: `apps/mobile-shell`

