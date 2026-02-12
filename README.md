# Jewellery Enterprise App

Enterprise-grade Next.js + Prisma foundation implementing strict role workflows for jewellery operations.

## Implemented capabilities
- Unified login route with JWT cookie session and role-based redirect.
- Strict RBAC middleware for protected dashboards and APIs.
- Prisma schema covering immutable products, allotment, customer confirmation, billing, gold collection, payment logs, and immutable audit logs.
- Core workflow APIs:
  - Product intake with duplicate barcode prevention.
  - Double-verified allotment.
  - Customer confirmation with matching engine.
  - Billing engine with making-charge formula.
  - Gold collection recording.
  - Main admin dashboard aggregate API.
- Modern glassmorphism dark UI shell with responsive dashboards for all six roles.

## Quick start
1. `npm install`
2. Copy `.env.example` to `.env` and fill values.
3. `npx prisma migrate dev`
4. `npm run dev`
