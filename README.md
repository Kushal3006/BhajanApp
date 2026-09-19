# Bhakti

Bhakti is a devotional bhajan application built with Next.js, Supabase PostgreSQL, Prisma, Supabase Storage, and Capacitor for Android.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production deployment

Configure these environment variables in the deployment platform:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_AUDIO_BUCKET=audio
SUPABASE_STORAGE_IMAGE_BUCKET=images
ADMIN_EMAILS=
```

Deploy with:

```bash
npm install
npm run build
```

Prisma Client is generated automatically by the `postinstall` script. After deployment, verify the database connection:

```text
https://your-domain.com/api/health
```

## Android production server

Set the deployed HTTPS URL before syncing Capacitor:

```env
CAPACITOR_SERVER_URL="https://your-domain.com"
```

Then run:

```bash
npx cap sync android
npx cap run android --prod
```

Do not use `localhost` in `CAPACITOR_SERVER_URL` for a physical phone. Use the deployed HTTPS domain or a computer LAN address for local testing.

## Database commands

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
```

## Capacitor commands

```bash
npm run mobile:sync
npm run mobile:open
npm run mobile:run
```
