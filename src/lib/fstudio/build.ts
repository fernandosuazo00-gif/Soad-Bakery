// Vendored from FStudio Admin (packages/sdk/src/build.ts @ eb594f2). Do not edit here: update from FStudio.
/**
 * @fstudio/sdk/build — for websites that are built from FStudio's catalog
 * (static sites: Astro, Next.js `output: 'export'`, plain Node scripts…).
 *
 *   import { runFStudioBuild } from '@fstudio/sdk/build'
 *   await runFStudioBuild({ build: async (catalog) => { ...write pages... } })
 *
 * Guarantees:
 *  - A failed or empty catalog request never produces an empty website: the
 *    build stops (the host keeps serving the last successful deployment), or
 *    — when you opt in — reuses the last good snapshot.
 *  - The build reports to FStudio (signed with the website secret) which
 *    catalogVersion it built, so FStudio knows what is live and converges on
 *    the newest version. Reporting problems never break the build.
 *
 * Environment (set once in the hosting provider, never committed):
 *   FSTUDIO_SITE_KEY        public site key
 *   FSTUDIO_API_URL         FStudio Admin origin
 *   FSTUDIO_SITE_SECRET     website secret (server/build only; FSTUDIO_WEBHOOK_SECRET also works)
 */
import { FStudioError, SITE_KEY_HEADER } from './client.ts'
import type { BuildReport, CmsCatalog } from './types.ts'
import { SIGNATURE_HEADER, signWebhook } from './webhooks.ts'

type Env = Record<string, string | undefined>
const env = (): Env => (typeof process !== 'undefined' ? process.env : {})

export type BuildConfig = {
  siteKey?: string
  apiUrl?: string
  /** Website secret for signed build reports. Without it, nothing is reported. */
  secret?: string
  /** Unique id of this build (defaults to the provider's deployment id). */
  buildId?: string
  fetch?: typeof fetch
}

export type LoadOptions = BuildConfig & {
  /** Attempts before giving up (default 3, with 1s/3s backoff). */
  retries?: number
  timeoutMs?: number
  /**
   * File where the last good catalog is kept (e.g. ".fstudio/catalog.json").
   * Written after every successful load.
   */
  snapshotPath?: string
  /**
   * What to do when FStudio can't be reached: 'fail' (default — the build
   * stops and the current website stays online) or 'snapshot' (build with the
   * last good snapshot; FStudio is told the website was not updated).
   */
  onError?: 'fail' | 'snapshot'
  /** Accept a catalog with no products (default false: treated as an error). */
  allowEmpty?: boolean
}

export type LoadedCatalog = { catalog: CmsCatalog; source: 'api' | 'snapshot' }

function config(c: BuildConfig) {
  const e = env()
  const siteKey = c.siteKey ?? e.FSTUDIO_SITE_KEY ?? e.NEXT_PUBLIC_FSTUDIO_SITE_KEY ?? e.PUBLIC_FSTUDIO_SITE_KEY ?? ''
  const apiUrl = (c.apiUrl ?? e.FSTUDIO_API_URL ?? e.NEXT_PUBLIC_FSTUDIO_API_URL ?? e.PUBLIC_FSTUDIO_API_URL ?? '').replace(/\/$/, '')
  if (!/^fs_site_[a-f0-9]{32}$/.test(siteKey)) throw new FStudioError('FSTUDIO_SITE_KEY is missing or invalid')
  if (!/^https?:\/\//.test(apiUrl)) throw new FStudioError('FSTUDIO_API_URL is missing or invalid')
  return {
    siteKey,
    apiUrl,
    secret: c.secret ?? e.FSTUDIO_SITE_SECRET ?? e.FSTUDIO_WEBHOOK_SECRET,
    buildId: c.buildId ?? defaultBuildId(e),
    fetch: c.fetch ?? globalThis.fetch,
  }
}

/** The hosting provider's id for this build, or a random one. */
export function defaultBuildId(e: Env = env()) {
  const id = e.FSTUDIO_BUILD_ID ?? e.VERCEL_DEPLOYMENT_ID ?? e.DEPLOYMENT_ID ?? e.BUILD_ID ?? e.CF_PAGES_COMMIT_SHA
  const clean = id?.replace(/[^A-Za-z0-9_.:-]/g, '').slice(0, 100)
  return clean || `build-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function isCatalog(value: unknown): value is CmsCatalog {
  const c = value as CmsCatalog
  return !!c && c.apiVersion === 2 && Array.isArray(c.products) && typeof c.catalogVersion === 'number' && !!c.schema
}

async function readSnapshot(path: string): Promise<CmsCatalog | null> {
  try {
    const { readFile } = await import('node:fs/promises')
    const data = JSON.parse(await readFile(path, 'utf8'))
    return isCatalog(data) ? data : null
  } catch {
    return null
  }
}

async function writeSnapshot(path: string, catalog: CmsCatalog) {
  const { mkdir, writeFile } = await import('node:fs/promises')
  const { dirname } = await import('node:path')
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(catalog))
}

/**
 * Fetches the CMS catalog for a build. Retries; refuses empty or malformed
 * catalogs; never returns an empty catalog because a request failed.
 */
export async function loadCatalogForBuild(options: LoadOptions = {}): Promise<LoadedCatalog> {
  const c = config(options)
  const { retries = 3, timeoutMs = 15_000, snapshotPath, onError = 'fail', allowEmpty = false } = options
  let lastError: Error = new FStudioError('FStudio catalog unavailable')

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await c.fetch(`${c.apiUrl}/api/public/v2/catalog`, {
        headers: { [SITE_KEY_HEADER]: c.siteKey, accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
        cache: 'no-store',
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        // A wrong key or a website that isn't connected won't fix itself.
        const permanent = [400, 404, 409].includes(response.status)
        lastError = new FStudioError(`FStudio catalog request failed (${response.status}${body.error ? `: ${body.error}` : ''})`, response.status)
        if (permanent) break
      } else {
        const data = (await response.json()) as unknown
        if (!isCatalog(data)) throw new FStudioError('FStudio returned an unexpected catalog format')
        if (!allowEmpty && data.products.length === 0) {
          // Never replace a working website with an empty one.
          throw new FStudioError('FStudio returned an empty catalog; refusing to build (pass allowEmpty to override)')
        }
        if (snapshotPath) await writeSnapshot(snapshotPath, data)
        return { catalog: data, source: 'api' }
      }
    } catch (error) {
      lastError = error instanceof FStudioError ? error : new FStudioError((error as Error).message)
      if (/empty catalog|unexpected catalog/.test(lastError.message)) break
    }
    if (attempt < retries) await sleep(attempt === 1 ? 1000 : 3000)
  }

  if (onError === 'snapshot' && snapshotPath) {
    const snapshot = await readSnapshot(snapshotPath)
    if (snapshot) return { catalog: snapshot, source: 'snapshot' }
  }
  throw lastError
}

/** Signed build reports (no-ops without a secret; never throws). */
export function createBuildReporter(options: BuildConfig = {}) {
  const c = config(options)
  async function report(event: BuildReport['event'], catalogVersion: number | null, error?: string) {
    if (!c.secret) return { ok: false, reason: 'no_secret' as const }
    const body: BuildReport = {
      event,
      catalogVersion,
      buildId: c.buildId,
      ...(error ? { error: error.replace(/\s+/g, ' ').slice(0, 200) } : {}),
    }
    const text = JSON.stringify(body)
    try {
      const response = await c.fetch(`${c.apiUrl}/api/public/v2/builds`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          [SITE_KEY_HEADER]: c.siteKey,
          [SIGNATURE_HEADER]: await signWebhook(c.secret, text),
        },
        body: text,
        signal: AbortSignal.timeout(10_000),
      })
      return { ok: response.ok, status: response.status }
    } catch (e) {
      console.warn(`[fstudio] could not report build ${event}: ${(e as Error).message}`)
      return { ok: false, reason: 'unreachable' as const }
    }
  }
  return {
    buildId: c.buildId,
    started: () => report('started', null),
    succeeded: (catalogVersion: number) => report('success', catalogVersion),
    failed: (error: string, catalogVersion: number | null = null) => report('failed', catalogVersion, error),
  }
}

/** The file a built website can publish (e.g. /fstudio-build.json) to show which catalog version it serves. */
export function buildManifest(catalog: CmsCatalog, buildId?: string) {
  return { catalogVersion: catalog.catalogVersion, generatedAt: catalog.generatedAt, builtAt: new Date().toISOString(), buildId }
}

/**
 * Loads the catalog, runs your build and reports the result. Any error stops
 * the build (rethrown) after FStudio is told it failed.
 */
export async function runFStudioBuild<T>(options: LoadOptions & { build: (catalog: CmsCatalog, info: { source: 'api' | 'snapshot'; buildId: string }) => Promise<T> | T }) {
  const reporter = createBuildReporter(options)
  await reporter.started()
  let version: number | null = null
  try {
    const { catalog, source } = await loadCatalogForBuild(options)
    version = catalog.catalogVersion
    const result = await options.build(catalog, { source, buildId: reporter.buildId })
    if (source === 'snapshot') await reporter.failed('catalog_unavailable: built with the last good snapshot', version)
    else await reporter.succeeded(version)
    return result
  } catch (error) {
    await reporter.failed((error as Error).message, version)
    throw error
  }
}
