// Vendored from FStudio Admin (packages/sdk/src/webhooks.ts @ 2332147). Do not edit here: update from FStudio.
/**
 * Webhook signatures (HMAC-SHA256), shared by FStudio Admin (signs) and
 * client websites (verify). Uses Web Crypto, so it runs on Node, Edge and
 * browsers alike.
 *
 * Header:  x-fstudio-signature: t=<unix seconds>,v1=<hex hmac of `${t}.${body}`>
 */

export const SIGNATURE_HEADER = 'x-fstudio-signature'
export const DEFAULT_TOLERANCE_SECONDS = 300

const encoder = new TextEncoder()

async function hmacHex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)))
  return Array.from(signature, (b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function signWebhook(secret: string, body: string, timestamp = Math.floor(Date.now() / 1000)) {
  return `t=${timestamp},v1=${await hmacHex(secret, `${timestamp}.${body}`)}`
}

/** True only for an untampered body signed with `secret` within the tolerance window. */
export async function verifyWebhook(
  secret: string,
  body: string,
  header: string | null | undefined,
  { toleranceSeconds = DEFAULT_TOLERANCE_SECONDS, now = Date.now() } = {},
) {
  if (!secret || !header) return false
  const parts = Object.fromEntries(
    header.split(',').map((part) => {
      const i = part.indexOf('=')
      return [part.slice(0, i).trim(), part.slice(i + 1).trim()]
    }),
  )
  const timestamp = Number(parts.t)
  if (!Number.isInteger(timestamp) || !parts.v1) return false
  if (Math.abs(now / 1000 - timestamp) > toleranceSeconds) return false
  return timingSafeEqual(parts.v1, await hmacHex(secret, `${timestamp}.${body}`))
}
