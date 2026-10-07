// Vendored from FStudio Admin (packages/sdk/src/client.ts @ 2332147). Do not edit here: update from FStudio.
import type { CmsCatalog, CmsSchemaResponse, PublicAvailability, PublicCatalog, PublicProduct } from './types.ts'

/** Cache tag used for every catalog fetch; the refresh route invalidates it. */
export const CATALOG_TAG = 'fstudio:catalog'
export const SITE_KEY_HEADER = 'x-fstudio-site-key'

export class FStudioError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'FStudioError'
    this.status = status
  }
}

export type FStudioConfig = {
  /** Public site key from FStudio Admin → Cliente → Sitio web. */
  siteKey: string
  /** FStudio Admin origin, e.g. https://fstudio-admin.vercel.app */
  apiUrl: string
  /**
   * Safety-net refresh in seconds (Next.js data cache). Instant updates come
   * from the signed webhook; this only bounds staleness if a webhook is missed.
   */
  revalidate?: number | false
  /** Custom fetch (tests). Defaults to the global fetch, resolved per call. */
  fetch?: typeof fetch
}

type NextFetchInit = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }

export function createFStudio({ siteKey, apiUrl, revalidate = 300, fetch: customFetch }: FStudioConfig) {
  if (!/^fs_site_[a-f0-9]{32}$/.test(siteKey)) throw new FStudioError('Invalid FStudio site key')
  const base = apiUrl.replace(/\/$/, '')
  const endpoint = `${base}/api/public/v1/catalog`

  async function cmsRequest<T>(path: 'catalog' | 'schema', fallback?: T): Promise<T> {
    try {
      const init: NextFetchInit = {
        headers: { [SITE_KEY_HEADER]: siteKey, accept: 'application/json' },
        next: { revalidate, tags: [CATALOG_TAG] },
      }
      const response = await (customFetch ?? globalThis.fetch)(`${base}/api/public/v2/${path}`, init)
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        throw new FStudioError(`FStudio ${path} request failed (${response.status}${body.error ? `: ${body.error}` : ''})`, response.status)
      }
      return (await response.json()) as T
    } catch (error) {
      if (fallback) return fallback
      throw error instanceof FStudioError ? error : new FStudioError((error as Error).message)
    }
  }

  async function getInventory(): Promise<PublicAvailability> {
    const init: NextFetchInit = {
      headers: { accept: 'application/json' },
      next: { revalidate, tags: [CATALOG_TAG] },
    }
    const response = await (customFetch ?? globalThis.fetch)(
      `${base}/api/public/v1/availability?site_key=${encodeURIComponent(siteKey)}`,
      init,
    )
    if (!response.ok) throw new FStudioError(`FStudio availability request failed (${response.status})`, response.status)
    return (await response.json()) as PublicAvailability
  }

  return {
    /**
     * Current catalog. Pass `fallback` (e.g. the site's previous hardcoded
     * products) so the page still renders if FStudio Admin is unreachable.
     */
    async getCatalog({ fallback }: { fallback?: PublicCatalog } = {}): Promise<PublicCatalog> {
      try {
        const init: NextFetchInit = {
          headers: { [SITE_KEY_HEADER]: siteKey, accept: 'application/json' },
          next: { revalidate, tags: [CATALOG_TAG] },
        }
        // Resolve fetch at call time: Next.js swaps in its caching fetch after
        // modules load, and only that one records the cache tag on the page.
        const response = await (customFetch ?? globalThis.fetch)(endpoint, init)
        if (!response.ok) throw new FStudioError(`FStudio catalog request failed (${response.status})`, response.status)
        return (await response.json()) as PublicCatalog
      } catch (error) {
        if (fallback) return fallback
        throw error instanceof FStudioError ? error : new FStudioError((error as Error).message)
      }
    },

    /**
     * API v2: the CMS catalog (websites in "hybrid" or "cms" mode). Schema,
     * products and catalogVersion come from one snapshot. Throws FStudioError
     * (status 409, `catalog_not_enabled`) for inventory-only websites.
     * Static builds should prefer `loadCatalogForBuild` (@fstudio/sdk/build),
     * which never lets a failed request publish an empty catalog.
     */
    async getCmsCatalog({ fallback }: { fallback?: CmsCatalog } = {}): Promise<CmsCatalog> {
      return cmsRequest<CmsCatalog>('catalog', fallback)
    },

    /** API v2 schema metadata only (types, fields, options, categories, collections, filters). */
    async getCmsSchema(): Promise<CmsSchemaResponse> {
      return cmsRequest<CmsSchemaResponse>('schema')
    },

    /**
     * Status map for every product (incl. hidden ones). Lighter than the
     * catalog; useful for sites that render products themselves.
     */
    async getAvailability(): Promise<PublicAvailability> {
      return getInventory()
    },

    /** Live inventory (same as getAvailability): keyed by product key, changes within seconds, never needs a rebuild. */
    async getInventory(): Promise<PublicAvailability> {
      return getInventory()
    },
  }

}

export const isAvailable = (product: Pick<PublicProduct, 'availability'>) => product.availability === 'available'

/** Products grouped by category, preserving catalog order; uncategorized last. */
export function groupByCategory(catalog: PublicCatalog) {
  const groups = new Map<string, { category: PublicProduct['category']; products: PublicProduct[] }>()
  for (const product of catalog.products) {
    const key = product.category?.slug ?? ''
    if (!groups.has(key)) groups.set(key, { category: product.category, products: [] })
    groups.get(key)!.products.push(product)
  }
  return [...groups.values()].sort((a, b) => (a.category ? 0 : 1) - (b.category ? 0 : 1))
}
