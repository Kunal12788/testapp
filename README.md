# Jewellery Enterprise Web Application (Next.js + Prisma)

Production-grade scaffold for the enterprise jewellery workflow platform with strict role-based controls, immutable audit logging, and inventory reconciliation logic.

## Included

- Next.js App Router + TypeScript + Tailwind + Framer Motion UI shell.
- Prisma PostgreSQL schema for all required entities.
- JWT auth login endpoint and role-based middleware.
- API route foundations for:
  - product intake (duplicate barcode block)
  - allotment (double verification required)
  - customer confirmation (mismatch flagging)
  - billing engine (rate + making charge calculations)
  - gold collection recording
  - inventory summary
  - audit log retrieval
- Soft workflow enforcement: no stock deletion route exists.

## Quick start

1. `cp .env.example .env`
2. Set `DATABASE_URL` and `JWT_SECRET`.
3. `npm install`
4. `npm run prisma:generate`
5. `npm run dev`

## Security notes

- Extend with CSRF middleware and rate limiting at the edge.
- Add TOTP-based 2FA flow for `MAIN_ADMIN` dual confirmation before mutation.
- Enforce HTTPS and secure cookie settings in deployment.
