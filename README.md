# Restaurant Ali Baba El Jadida

Site vitrine premium Next.js + TailwindCSS + Prisma SQLite avec back-office.

## Commandes

```bash
npm install
npm run db:init
npm run db:seed
npm run dev
npm run build
```

Le back-office est disponible sur `/admin`. Les identifiants sont lus depuis les variables d’environnement `ADMIN_USERNAME`, `ADMIN_PASSWORD` et `AUTH_SECRET`.

Une migration SQL versionnée est présente dans `prisma/migrations`. Le script `db:init` initialise SQLite localement avec cette migration, utile si le moteur de migration Prisma n’est pas disponible sur la machine de développement.

Les uploads sont stockés localement dans `public/uploads` en développement. Pour la production, connectez le champ `imageUrl` ou l’action `saveUploadedImage` à Cloudinary, Supabase Storage ou un stockage S3-compatible.
