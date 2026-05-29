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

1. Créer une base PostgreSQL managée sur Neon ou Supabase.
2. Ouvrir `Vercel > Project > Settings > Environment Variables`.
3. Ajouter `DATABASE_URL` (URL PostgreSQL distante, jamais localhost).
4. Ajouter `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
5. Pousser le projet sur GitHub.
6. Vercel exécute automatiquement :
   - `prisma migrate deploy`
   - `prisma generate`
   - `next build`

Le script `build` est :

```bash
prisma migrate deploy && prisma generate && next build
```

## Notes

- Si `DATABASE_URL` est absent, le build échoue immédiatement avec un message explicite.
- Sur Vercel, le build échoue aussi si `DATABASE_URL` pointe vers `localhost` ou `127.0.0.1`.
- Les pages publiques utilisent des fallbacks serveur élégants si la base est vide.
- Le back-office reste strictement branché sur Prisma/PostgreSQL (pas de fallback silencieux côté admin).
- Les uploads restent locaux dans `public/uploads` tant qu'aucun stockage externe n'est configuré.
