# SOAD Bakery → FStudio Full CMS: cutover runbook

Status: catalog imported into FStudio (`soad-bakery`, 59 products, parity verified); this branch
(`fstudio-cms`) builds the site from FStudio and was verified against production (local build and a
Vercel preview: identical products, photos byte-identical, identical markup). **Production still runs
`main` with `src/data/products.ts`.** SOAD in FStudio stays in inventory mode until step 2.

## 1. Owner access (FStudio, Super Admin)

Clientes → SOAD Bakery → Equipo → **Invitar** → owner's email, role **Propietario**. The invitation creates
the membership, which satisfies the CMS readiness check (someone on SOAD's team can manage the catalog).

## 2. Switch SOAD to CMS, connect the website without rebuilds yet

```bash
# fstudio-admin/apps/admin
node --env-file=.env.local scripts/catalog-migration.mts mode soad-bakery cms
SOAD_SECRET_FILE=/secure/tmp/soad-secret \
node --env-file=.env.local scripts/catalog-migration.mts website soad-bakery --mode cms --refresh none --new-secret-env SOAD_SECRET_FILE
```

## 3. Vercel (project `soadbakery`) — Production environment only

`FSTUDIO_SITE_KEY` (FStudio → SOAD → Sitio web), `FSTUDIO_API_URL=https://fstudio-admin.vercel.app`,
`FSTUDIO_SITE_SECRET` (from the file, type Encrypted). Remove the temporary branch-scoped Preview variables.
Previews then fail safely (no key) and never report to FStudio.

## 4. Verify before merging

1. Save the current production pages: `node scripts/fstudio-parity.mjs https://www.soadbakery.com <local build>`
   with a local build of this branch using SOAD's real site key → must print `Parity: identical.`
2. Keep a copy of production HTML/photos for the post-merge comparison.

## 5. Merge `fstudio-cms` → `main`

Vercel builds production from FStudio. Verify: parity (saved production copy vs live), mobile, cart, WhatsApp,
PedidosYa, `/fstudio-build.json` shows the catalog version, FStudio shows the build as live.

## 6. Turn on automatic rebuilds

Create a deploy hook in Vercel (`main`), then:

```bash
SOAD_HOOK=<hook url> node --env-file=.env.local scripts/catalog-migration.mts website soad-bakery --refresh rebuild --delay 30 --hook-env SOAD_HOOK
```

(Only after step 5: before it, a rebuild of the old `main` would never report and would time out.)

## 7. Real end-to-end tests, then restore

Content edit → rebuild → live; Agotado via live inventory (no rebuild); temporary draft → publish → appears in
its category and in All Items → archive → disappears. Restore everything immediately.

## Rollback

Revert the merge on `main` (the site goes back to `src/data/products.ts`), set SOAD's website to
`--refresh none`. FStudio keeps every change made meanwhile.
