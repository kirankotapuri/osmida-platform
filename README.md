# Osmida: Multi-Portal Lead Management Platform

Lead, inspection, quote and booking management with Customer, Partner and Admin portals.
**Status: in development.** Portals and database are built; n8n automation is in progress.

## Features
- Customer, Partner and Admin portals
- Normalized PostgreSQL schema: leads, inspections, quotes, bookings
- [add only what exists]

## Architecture
![Architecture](docs/architecture.png)

## Tech stack
[your frontend framework] · Supabase (PostgreSQL, Auth) · [hosting]

## Getting started
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your values
3. Apply the migrations in `supabase/migrations`
4. [install and run commands]

## Database
![ERD](docs/erd.png)

## Roadmap
- [ ] n8n lead intake with validation and duplicate protection
- [ ] WhatsApp status updates with delivery logging
- [ ] Failure alerts and retries
- [ ] Tests and CI

## Known limitations
[state them honestly]
