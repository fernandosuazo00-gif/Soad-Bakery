// Vendored from FStudio Admin (packages/sdk/src/types.ts @ eb594f2). Do not edit here: update from FStudio.
/** Public contract between FStudio Admin and client websites (API v1). */

export type SiteKey = `fs_site_${string}`

export type Availability = 'available' | 'sold_out'

export type PublicProduct = {
  id: string
  slug: string
  name: string
  description: string | null
  category: { slug: string; name: string } | null
  price: { amount: number; currency: string } | null
  imageUrl: string | null
  availability: Availability
  /** Industry-specific fields (size, ml, allergens…), defined per business. */
  attributes: Record<string, unknown>
  /** 'variants' when stock is kept per variant (sizes…); availability is then derived. */
  inventoryMode: 'simple' | 'variants'
  /** Units in stock — only when the business publishes exact quantities. */
  quantity: number | null
  /** Tracked stock at or below the business's threshold (null when not published). */
  lowStock: boolean | null
  /** Option definitions in display order, e.g. [{ name: 'Talla', values: ['M', 'L'] }]. */
  options: ProductOption[]
  /** Active variants in display order; null for simple products. */
  variants: PublicVariant[] | null
  updatedAt: string
}

export type ProductOption = { name: string; values: string[] }

export type PublicVariant = {
  /** Stable identifier within the product, e.g. "m", "2xl". */
  id: string
  name: string
  options: Record<string, string>
  /** Overrides the product price when set. */
  price: { amount: number; currency: string } | null
  availability: Availability
  /** Units in stock — only when the business publishes exact quantities. */
  quantity: number | null
  /** Tracked stock at or below the business's threshold (null when not published). */
  lowStock: boolean | null
}

export type PublicCatalog = {
  business: {
    name: string
    slug: string
    currency: string
    locale: string
    timezone: string
    logoUrl: string | null
  }
  website: { id: string; domain: string | null }
  /** Modules enabled for the business, e.g. ["inventory", "products"]. */
  modules: string[]
  categories: { slug: string; name: string }[]
  /** Only visible, non-archived products are ever returned. */
  products: PublicProduct[]
  /** +1 whenever the catalog content changes (never for stock). Lets sites know whether they are up to date. */
  catalogVersion: number
  generatedAt: string
}

/**
 * Status of every product a website may render (including hidden/archived
 * ones as visible=false). Keys are product identifiers (slugs), which should
 * match the identifiers the website already uses.
 */
/**
 * Tracked stock is published per the business setting: nothing ('hidden'),
 * `low_stock` only (default), or `quantity` + `low_stock` ('exact').
 */
export type StockInfo = { quantity?: number; low_stock?: boolean }

export type AvailabilityEntry = StockInfo & {
  availability: Availability
  visible: boolean
  /** Variant products only: status per variant id. */
  variants?: Record<string, StockInfo & { availability: Availability }>
}

export type PublicAvailability = {
  products: Record<string, AvailabilityEntry>
  generatedAt: string
}

/** Signed events FStudio Admin POSTs to a website's refresh route. */
export type WebhookEvent =
  | { type: 'catalog.updated'; websiteId: string; sentAt: string }
  | { type: 'ping'; websiteId: string; sentAt: string }

// =============================================================================
// API v2 — the CMS catalog for websites that use FStudio as their catalog
// source of truth (integration mode "hybrid" or "cms"). Keys, never internal
// ids: every identifier below is a stable key FStudio never rewrites.
// =============================================================================

/**
 * How a website is connected (configured per website in FStudio Admin):
 *  - inventory: the website owns its catalog; FStudio owns availability/stock (API v1).
 *  - hybrid: FStudio owns the parts in `scope` + stock; the website keeps the rest.
 *  - cms: FStudio owns catalog content + stock; the website renders FStudio's catalog.
 */
export type IntegrationMode = 'inventory' | 'hybrid' | 'cms'

/** What FStudio owns on a hybrid website. */
export type CmsScope = 'content' | 'prices' | 'images' | 'attributes' | 'placement' | 'new_products'

/** How the website picks up catalog changes. */
export type RefreshStrategy = 'none' | 'revalidate' | 'rebuild'

export type Money = { amount: number; currency: string }

/** A field value: text/long text/url/date → string, number, yes/no, select → option key, multi-select → option keys. */
export type FieldValue = string | number | boolean | string[]

/** Tracked stock, per the business's quantity privacy setting ({} when private). */
export type CmsStock = { quantity?: number; lowStock?: boolean }

export type CmsImage = { url: string; alt: string | null; altEn: string | null; width: number | null; height: number | null }

export type CmsVariant = {
  key: string
  name: string
  options: Record<string, string>
  /** Overrides the product price when set. */
  price: Money | null
  availability: Availability
  stock: CmsStock
}

export type CmsProduct = {
  /** Stable product key (what websites match on, and what the live inventory API is keyed by). */
  key: string
  name: string
  description: string | null
  price: Money | null
  /** Product type key (see schema.types). */
  type: string | null
  /** Primary category key (null when the product has none). */
  primaryCategory: string | null
  /** Every category key, primary first. */
  categories: string[]
  collections: string[]
  /** In order; the first one is the main photo. */
  images: CmsImage[]
  /** Public values of the product's current type, keyed by field key. */
  fields: Record<string, FieldValue>
  /** The filterable subset of `fields`, using active options only. */
  filters: Record<string, FieldValue>
  inventoryMode: 'simple' | 'variants'
  options: ProductOption[]
  variants: CmsVariant[] | null
  /** Availability when the catalog was generated; overlay live inventory for the current state. */
  availability: Availability
  stock: CmsStock
  sortOrder: number
  updatedAt: string
  publishedAt: string | null
}

export type CmsFieldOption = { key: string; label: string; labelEn: string | null; sortOrder: number }

export type CmsField = {
  key: string
  type: 'text' | 'long_text' | 'number' | 'boolean' | 'select' | 'multi_select' | 'date' | 'url'
  label: string
  labelEn: string | null
  help: string | null
  helpEn: string | null
  /** Offered as a website filter. */
  filter: boolean
  /** Include in the website's search index. */
  searchable: boolean
  /** Worth a landing page per option (e.g. /perfumes/unisex). */
  landing: boolean
  sortOrder: number
  validation: Record<string, unknown>
  /** Active options only (select / multi_select), in display order. */
  options: CmsFieldOption[] | null
}

export type CmsType = {
  key: string
  name: string
  nameEn: string | null
  variants: 'none' | 'optional' | 'required'
  sortOrder: number
  fields: { key: string; required: boolean }[]
  /** Category keys valid for this type (null = every category). */
  categories: string[] | null
  primaryCategoryRequired: boolean
  additionalCategories: boolean
  maxAdditionalCategories: number | null
}

export type CmsCategory = { key: string; name: string; nameEn: string | null; parent: string | null; sortOrder: number }

export type CmsCollection = {
  key: string
  name: string
  nameEn: string | null
  description: string | null
  descriptionEn: string | null
  sortOrder: number
}

export type CmsSchema = {
  types: CmsType[]
  /** Public, active fields. */
  fields: CmsField[]
  /** Visible, active categories (tree via `parent`). */
  categories: CmsCategory[]
  collections: CmsCollection[]
  /** Field keys, in display order. */
  filters: string[]
  searchable: string[]
  landing: string[]
}

type CmsEnvelope = {
  apiVersion: 2
  business: { name: string; slug: string; currency: string; locale: string; timezone: string; logoUrl: string | null }
  website: { domain: string | null; integration: IntegrationMode; scope: CmsScope[]; refresh: RefreshStrategy }
  /** +1 whenever catalog content changes (never for stock). The schema and products of one response always match it. */
  catalogVersion: number
  catalogChangedAt: string | null
  schema: CmsSchema
  generatedAt: string
}

/** GET /api/public/v2/catalog */
export type CmsCatalog = CmsEnvelope & { products: CmsProduct[] }

/** GET /api/public/v2/schema (no products). */
export type CmsSchemaResponse = CmsEnvelope

/** POST /api/public/v2/builds — a build tells FStudio what it did (signed with the website secret). */
export type BuildReport = {
  event: 'started' | 'success' | 'failed'
  /** The catalogVersion the build fetched (required for success). */
  catalogVersion: number | null
  /** The provider's build id (or any unique id per build): makes reports idempotent. */
  buildId: string
  /** Short, non-secret reason for a failure. */
  error?: string
}
