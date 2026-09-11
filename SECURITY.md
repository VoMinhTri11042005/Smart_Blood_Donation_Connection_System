# Security and secrets

## Never commit secrets

Keep credentials in Vercel, Render, Neon, Cloudinary, or local environment
variables. The repository only contains `.env.example` placeholders.

Ignored secret files include `.env` variants, private keys, certificates, and
local database files. If a credential is ever committed, treat it as exposed:
revoke or rotate it immediately, then update the hosting service.

## Required production variables

Configure these on the backend service only:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - long random signing secret
- `CLOUDINARY_URL` - Cloudinary API environment URL

Configure this on the frontend service:

- `VITE_API_URL` - public backend URL without the `/api` suffix

`VITE_*` values are bundled into frontend JavaScript and must never contain
passwords, API keys, or other sensitive credentials.
