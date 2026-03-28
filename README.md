# Heartbeat

> Uptime monitoring and status pages — self-hosted or deployed to Vercel in one click.

Monitor your services, track incidents, and publish a public status page. Built as a clean, modern alternative to paid uptime tools.

## Features

- **Monitors** — HTTP checks with configurable intervals and alerting
- **Incidents** — Create, track, and resolve incidents with a full timeline
- **Status Pages** — Public-facing pages per service at `/s/[slug]`
- **Auth** — Clerk (email, OAuth, SSO)
- **Payments** — Stripe checkout + billing portal

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Auth | Clerk |
| Database | Neon Postgres + Drizzle ORM |
| Cache / Queue | Upstash Redis |
| Payments | Stripe |
| UI | Base UI + Radix UI, Tailwind CSS, Framer Motion |
| Font | Geist |
| Tests | Vitest |

## Getting Started

```bash
git clone https://github.com/your-username/heartbeat.git
cd heartbeat
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Neon
DATABASE_URL=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Push the schema and start dev:

```bash
npx drizzle-kit push
npm run dev
```

## Project Structure

```
src/app/
├── (dashboard)/
│   ├── monitors/        # Monitor management
│   ├── incidents/       # Incident tracker
│   ├── status-pages/    # Status page builder
│   └── settings/
├── (marketing)/         # Landing page + pricing
└── s/[slug]/            # Public status pages
```

## Tests

```bash
npm run test
```
