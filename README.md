# Bazaar Vision (Next.js, Vercel-ready)

## Deploy on Vercel
1) Upload these files to a new GitHub repo (root, not a subfolder).
2) In Vercel: New Project → Import → select repo.
3) Environment Variables:
   - NEXT_PUBLIC_DATA_SOURCE = tibiadata
   - NEXT_PUBLIC_TIBIADATA_URL = https://api.tibiadata.com/v3
4) Deploy.

Local dev:
```
corepack enable
pnpm i
pnpm dev
```