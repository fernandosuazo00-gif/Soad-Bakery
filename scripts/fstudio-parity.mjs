/**
 * Parity check between two renderings of the SOAD Bakery website — e.g. the
 * current production site and an FStudio-powered build (local dist or a
 * Vercel preview). Compares every product card (order, id, name, price,
 * description, category, photo alt and pixels), the category chips, the
 * featured products on the home page, availability, and every page's markup
 * with asset file names normalized.
 *
 *   node scripts/fstudio-parity.mjs https://www.soadbakery.com ./dist
 *   node scripts/fstudio-parity.mjs https://www.soadbakery.com https://<preview>.vercel.app
 *
 * Exit code 1 when anything differs.
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const [a, b] = process.argv.slice(2)
if (!a || !b) throw new Error('Usage: fstudio-parity.mjs <site-or-dist A> <site-or-dist B>')
const PAGES = ['/', '/productos', '/nuestra-historia', '/vending', '/contacto', '/404']
const headers = process.env.VERCEL_BYPASS ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS } : {}

const isDir = (src) => !/^https?:\/\//.test(src)
async function page(src, path) {
  if (isDir(src)) {
    const file = path === '/' ? 'index.html' : existsSync(join(src, `${path.slice(1)}.html`)) ? `${path.slice(1)}.html` : join(path.slice(1), 'index.html')
    return readFileSync(join(src, file), 'utf8')
  }
  const r = await fetch(new URL(path, src), { headers, redirect: 'follow' })
  if (!r.ok && path !== '/404') throw new Error(`${src}${path} → HTTP ${r.status}`)
  return r.text()
}
async function asset(src, path) {
  if (isDir(src)) return readFileSync(join(src, path))
  const r = await fetch(new URL(path, src), { headers })
  if (!r.ok) throw new Error(`${src}${path} → HTTP ${r.status}`)
  return Buffer.from(await r.arrayBuffer())
}

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
function cards(html) {
  return [...html.matchAll(/<article[^>]*data-product-card[\s\S]*?<\/article>/g)].map(([card]) => {
    const payload = JSON.parse(decode(card.match(/data-add-to-cart="([^"]+)"/)[1]))
    const img = card.match(/<img[^>]*>/)?.[0] ?? ''
    return {
      id: payload.id,
      name: payload.name,
      price: payload.price,
      category: card.match(/data-category="([^"]*)"/)[1],
      description: decode(card.match(/<p class="text-sm[^"]*"[^>]*>([\s\S]*?)<\/p>/)[1]),
      alt: decode(img.match(/alt="([^"]*)"/)?.[1] ?? ''),
      src: img.match(/ src="([^"]+)"/)?.[1] ?? null,
      size: [img.match(/width="(\d+)"/)?.[1], img.match(/height="(\d+)"/)?.[1]].join('x'),
      availability: card.match(/data-fstudio-availability="([^"]+)"/)?.[1] ?? 'available',
    }
  })
}
const chips = (html) => [...html.matchAll(/data-category-chip="([^"]+)"[^>]*>\s*([^<]+?)\s*</g)].map((m) => `${m[1]}:${m[2]}`)
// Markup without what legitimately differs: asset file names, the FStudio
// availability attributes/styles and the live-inventory script tag.
const normalize = (html) =>
  html
    .replace(/ data-astro-cid-[a-z0-9]+(="[^"]*")?/g, '')
    .replace(/\/_astro\/[^"'\s),]+/g, '/_astro/*')
    .replace(/ data-fstudio-[a-z-]+="[^"]*"/g, '')
    .replace(/<script[^>]*fstudio-live\.js[^>]*><\/script>/g, '')
    .replace(/<span class="sold-out-badge[\s\S]*?<\/span>/g, '')
    .replace(/<span class="label-available">([\s\S]*?)<\/span>\s*<span class="label-sold-out">[\s\S]*?<\/span>/g, '$1')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/\s+/g, ' ')

const problems = []
const note = (msg) => problems.push(msg)

const [prodA, prodB] = await Promise.all([page(a, '/productos'), page(b, '/productos')])
const ca = cards(prodA)
const cb = cards(prodB)
console.log(`Products: ${ca.length} vs ${cb.length}`)
if (ca.length !== cb.length) note(`product count ${ca.length} ≠ ${cb.length}`)
if (JSON.stringify(chips(prodA)) !== JSON.stringify(chips(prodB))) note(`category chips ${chips(prodA)} ≠ ${chips(prodB)}`)

const sha = (buf) => createHash('sha256').update(buf).digest('hex')
let pixelsSame = 0
for (let i = 0; i < Math.max(ca.length, cb.length); i++) {
  const x = ca[i]
  const y = cb[i]
  if (!x || !y) { note(`#${i}: only in one side (${x?.id ?? y?.id})`); continue }
  for (const k of ['id', 'name', 'price', 'category', 'description', 'alt', 'size', 'availability']) {
    if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) note(`${x.id} ${k}: ${JSON.stringify(x[k])} ≠ ${JSON.stringify(y[k])}`)
  }
  if (x.src && y.src) {
    const [ia, ib] = await Promise.all([asset(a, x.src), asset(b, y.src)])
    if (sha(ia) === sha(ib)) pixelsSame++
    else note(`${x.id} photo bytes differ (${ia.length} vs ${ib.length} bytes)`)
  } else if (x.src !== y.src) note(`${x.id} photo missing on one side`)
}
console.log(`Photos byte-identical: ${pixelsSame}/${ca.length}`)

const [homeA, homeB] = await Promise.all([page(a, '/'), page(b, '/')])
const fa = cards(homeA).map((c) => c.id)
const fb = cards(homeB).map((c) => c.id)
console.log(`Featured: ${fa.join(', ')}`)
if (JSON.stringify(fa) !== JSON.stringify(fb)) note(`featured ${fa} ≠ ${fb}`)

for (const path of PAGES) {
  const [x, y] = await Promise.all([page(a, path), page(b, path)])
  if (normalize(x) !== normalize(y)) {
    const nx = normalize(x)
    const ny = normalize(y)
    let i = 0
    while (i < nx.length && nx[i] === ny[i]) i++
    note(`${path} markup differs near: …${nx.slice(Math.max(0, i - 80), i + 80)}… vs …${ny.slice(Math.max(0, i - 80), i + 80)}…`)
  }
}
console.log(`Pages compared: ${PAGES.join(' ')}`)

if (problems.length) {
  console.log(`\n${problems.length} difference(s):`)
  for (const p of problems.slice(0, 40)) console.log(' -', p)
  process.exitCode = 1
} else {
  console.log('\nParity: identical.')
}
