import { readFileSync } from "node:fs";
import { loadCatalogForBuild } from "../lib/fstudio/build.ts";
import type { CmsCatalog } from "../lib/fstudio/types.ts";

/**
 * SOAD Bakery's catalog comes from FStudio Admin (Full CMS): names,
 * descriptions, prices, photos, categories, the "Nuestros favoritos"
 * selection and availability are managed there by SOAD. This file only maps
 * FStudio's catalog to the shape the site's components use — the design
 * stays in the components.
 *
 * Build: `npm run build` loads the catalog once (scripts/fstudio-build.mts)
 * and passes it in FSTUDIO_CATALOG_FILE. Dev: set FSTUDIO_SITE_KEY and
 * FSTUDIO_API_URL (or FSTUDIO_CATALOG_FILE) in .env.
 */
const catalog: CmsCatalog = process.env.FSTUDIO_CATALOG_FILE
  ? JSON.parse(readFileSync(process.env.FSTUDIO_CATALOG_FILE, "utf8"))
  : (await loadCatalogForBuild()).catalog;

/** The FStudio collection shown as "Nuestros favoritos" on the home page. */
const FEATURED_COLLECTION = "destacados";

/**
 * Category chips, in FStudio's order. "All Items" is the site's view of
 * every published product, not a category in FStudio.
 */
export const categories = [
  { id: "todos", label: "All Items" },
  ...catalog.schema.categories
    .filter((c) => c.parent === null)
    .map((c) => ({ id: c.key, label: c.name })),
];

export type CategoryId = string;

export interface Product {
  id: string;
  name: string;
  /** Primary category key ("" when FStudio has none). */
  category: string;
  /** Price in Honduran Lempiras. `null` = "próximamente". */
  price: number | null;
  description: string;
  /** Main photo (FStudio storage URL); null when the product has no photo yet. */
  image: string | null;
  alt: string;
  featured?: boolean;
  /** At build time; live inventory updates it in the browser without a rebuild. */
  availability: "available" | "sold_out";
}

export const products: Product[] = [...catalog.products]
  .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "es"))
  .map((p) => ({
    id: p.key,
    name: p.name,
    category: p.primaryCategory ?? "",
    price: p.price?.amount ?? null,
    description: p.description ?? "",
    image: p.images[0]?.url ?? null,
    alt: p.images[0]?.alt ?? p.name,
    featured: p.collections.includes(FEATURED_COLLECTION),
    availability: p.availability,
  }));

export const catalogVersion = catalog.catalogVersion;

export const getProductsByCategory = (category: CategoryId): Product[] =>
  category === "todos" ? products : products.filter((p) => p.category === category);

export const featuredProducts = products.filter((p) => p.featured);

export { formatLempiras } from "../lib/currency";
