/**
 * Production build: catalog from FStudio Admin (API v2), then the normal
 * Astro build. Run by `npm run build` (Vercel).
 *
 *  - The catalog is fetched once (retries; an empty or malformed catalog is
 *    refused) and handed to Astro through a file, so every page uses the
 *    same catalog version.
 *  - If FStudio can't be reached or the build fails, the build stops and
 *    Vercel keeps serving the last successful deployment.
 *  - FStudio is told which catalog version was built (signed report), so
 *    the owner sees "Sitio web actualizado".
 *
 * Env (Vercel → Settings → Environment Variables): FSTUDIO_SITE_KEY,
 * FSTUDIO_API_URL, FSTUDIO_SITE_SECRET (build only, never in the browser).
 */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildManifest, runFStudioBuild } from '../src/lib/fstudio/build.ts'

const root = join(import.meta.dirname, '..')

const run = (cmd: string, args: string[], env: Record<string, string>) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } })
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`astro build exited with code ${code}`))))
    child.on('error', reject)
  })

await runFStudioBuild({
  async build(catalog, { buildId }) {
    const file = join(root, '.fstudio', 'catalog.json')
    mkdirSync(join(root, '.fstudio'), { recursive: true })
    writeFileSync(file, JSON.stringify(catalog))
    console.log(`[fstudio] catalog v${catalog.catalogVersion}: ${catalog.products.length} products`)
    await run(join(root, 'node_modules', '.bin', 'astro'), ['build'], { FSTUDIO_CATALOG_FILE: file })
    writeFileSync(join(root, 'dist', 'fstudio-build.json'), JSON.stringify(buildManifest(catalog, buildId)))
  },
})
