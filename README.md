# Restaurant Ali Baba El Jadida

Site vitrine + back-office sous Next.js (App Router), Prisma ORM et PostgreSQL.

## Prérequis

- Node.js 20+
- PostgreSQL (local ou cloud: Supabase/Neon)

## Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner :

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

## Commandes locales

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run lint
npm run build
npm run dev
```

## Déploiement Vercel

1. Créer une base PostgreSQL (Supabase ou Neon).
2. Ajouter `DATABASE_URL` dans Vercel.
3. Ajouter `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Pousser le projet sur GitHub.
5. Vercel exécute automatiquement :
   - `prisma migrate deploy`
   - `prisma generate`
   - `next build`

Le script `build` est configuré pour cela sur Vercel/CI :

```bash
node scripts/build.mjs
```

## Notes

- Les pages publiques utilisent des fallbacks serveur élégants si la base est vide ou indisponible au build.
- Le back-office reste strictement branché sur Prisma/PostgreSQL (pas de fallback silencieux côté admin).
- Les uploads restent locaux dans `public/uploads` tant qu'aucun stockage externe n'est configuré.
