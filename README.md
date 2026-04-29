# Heartbeat

Uptime monitoring and public status pages for teams that want a modern status product on Next.js.

Heartbeat combines monitor management, incident tracking, public status pages, API access, and email notifications in one app. The current repo includes dashboard flows, a cron-driven monitoring route, public status pages, subscriber notifications, and a solid Vitest suite.

## Features

- HTTP monitoring with configurable method, expected status, timeout, and interval
- Monitor status tracking with response-time-based degraded/down states
- Incident management with incident timelines and status updates
- Public status pages at `/s/[slug]`
- Subscriber email notifications for status page updates
- API key management for authenticated organizations
- Status API at `/api/v1/status/[slug]`
- Cron-based check execution via `/api/cron/monitor`
- Authentication and org flows with Clerk
- Billing hooks with Stripe
- Tests covering monitoring logic, API helpers, UI components, rate limiting, and schema behavior

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Database:** Neon Postgres + Drizzle ORM
- **Auth:** Clerk
- **Cache / rate limiting:** Upstash Redis
- **Email:** Resend
- **Payments:** Stripe
- **UI:** Tailwind CSS v4, Base UI, Radix UI, Framer Motion
- **Charts:** Recharts
- **Testing:** Vitest, Testing Library

## Local Setup

```bash
git clone https://github.com/Mars375/heartbeat.git
cd heartbeat
npm install
cp .env.example .env.local
```

Fill in `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/monitors
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
CRON_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Prepare the database and start the app:

```bash
npm run db:push
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Project Status

**Current status: feature-rich prototype / early app.**

The repo already includes the core monitoring, incident, status-page, notification, and API-key flows, plus tests for important logic. Running it locally still requires configuring several external services, especially Clerk, Neon, Upstash, Resend, and Stripe.
