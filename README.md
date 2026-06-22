# Restaurant Ali Baba El Jadida

Site vitrine + back-office sous Next.js (App Router), Prisma ORM et PostgreSQL.

## Prérequis

- Node.js 20+
- PostgreSQL (local ou cloud: Neon recommandé)

## Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner :

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `LOYALTY_SCAN_COOLDOWN_MINUTES`

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

1. Créer une base PostgreSQL managée sur Neon.
2. Ouvrir `Vercel > Project > Settings > Environment Variables`.
3. Ajouter `DATABASE_URL` (URL PostgreSQL distante, jamais localhost).
4. Ajouter `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `LOYALTY_SCAN_COOLDOWN_MINUTES`.
5. Cocher les environnements `Production`, `Preview` et `Development` pour chaque variable.
6. Pousser le projet sur GitHub.
7. Vercel exécute automatiquement :
   - `prisma migrate deploy`
   - `prisma generate`
   - `next build`
8. Relancer un redéploiement (`Redeploy`) depuis Vercel.

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

## Fidélité digitale

- Page publique de création : `/fidelite`.
- Carte client avec QR code : `/fidelite/[publicToken]`.
- Back-office fidélité : `/admin/fidelite`.
- Scanner staff : `/admin/fidelite/scan`.
- Le QR code contient uniquement l’URL publique avec token non devinable.
- Les validations passent par des server actions protégées par session admin.
- Le délai anti double scan est contrôlé par `LOYALTY_SCAN_COOLDOWN_MINUTES`.

## Wallet V2

Les routes `/api/wallet/apple` et `/api/wallet/google` sont des placeholders V2 et ne bloquent pas la V1.

Apple Wallet nécessite :

- Apple Developer Program
- Pass Type ID
- Pass Type ID Certificate
- signature `.pkpass`

Google Wallet nécessite :

- Google Wallet issuer account
- Google Cloud service account
- Google Wallet API

## Menu PDF & QR menu

- Page menu publique : `/menu`.
- PDF public du menu : `/documents/menu-restaurant-ali-baba.pdf`.
- Page QR imprimable : `/qr-menu`.
- Back-office PDF/QR : `/admin/menu-pdf`.
- Source structurée extraite du PDF : `data/ali-baba-menu.json`.

Pour importer ou mettre à jour les catégories, plats, descriptions, prix et le document actif dans PostgreSQL :

```bash
npm run menu:import
```

La commande est idempotente : elle met à jour les lignes existantes par nom + catégorie et conserve les prix exacts du PDF source.
