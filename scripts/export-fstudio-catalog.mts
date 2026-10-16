/**
 * Exports the current SOAD Bakery catalog (src/data/products.ts) as an
 * fstudio-catalog/v1 file for FStudio Admin's catalog import. Read-only:
 * nothing in the site changes. Product ids, names, prices, descriptions,
 * categories, alt texts, order and the featured selection are copied exactly;
 * images are referenced by their source files (uploaded once to FStudio).
 *
 *   node scripts/export-fstudio-catalog.mts > fstudio-catalog.json
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = join(import.meta.dirname, '..')
let source = readFileSync(join(root, 'src/data/products.ts'), 'utf8')
// Image imports become plain references to the source files.
source = source.replace(/^import (\w+) from "\.\.\/assets\/(menu\/[^"]+)";$/gm, (_, name, file) => `const ${name} = { src: "src/assets/${file}" } as any;`)
source = source.replace(/^import type .*$/gm, '').replace(/^export \{ formatLempiras \}.*$/m, '')
source = source.replace(/: ImageMetadata/g, ': { src: string }')
const dir = mkdtempSync(join(tmpdir(), 'soad-export-'))
writeFileSync(join(dir, 'products.ts'), source)
const { categories, products } = (await import(pathToFileURL(join(dir, 'products.ts')).href)) as {
  categories: readonly { id: string; label: string }[]
  products: { id: string; name: string; category: string; price: number | null; description: string; image: { src: string }; alt: string; featured?: boolean }[]
}

const catalog = {
  format: 'fstudio-catalog/v1',
  source: { name: 'soadbakery.com', url: 'https://www.soadbakery.com', generated_at: new Date().toISOString() },
  currency: 'HNL',
  // "All Items" is the website's view of every product, not a category.
  categories: categories.filter((c) => c.id !== 'todos').map((c) => ({ id: c.id, name: c.label })),
  collections: [{ id: 'destacados', name: 'Nuestros favoritos' }],
  products: products.map((p, i) => ({
    id: p.id,
    name: p.name,
    type: 'producto',
    category: p.category,
    collections: p.featured ? ['destacados'] : [],
    price: p.price,
    description: p.description,
    images: [{ path: p.image.src, alt: p.alt }],
    availability: 'available',
    visibility: 'visible',
    sort_order: (i + 1) * 10,
  })),
}
process.stdout.write(JSON.stringify(catalog, null, 2) + '\n')
