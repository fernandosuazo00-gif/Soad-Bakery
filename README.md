# SOAD Bakery — sitio web

Sitio de marketing y catálogo para SOAD Bakery (Tegucigalpa, Honduras), construido con [Astro](https://astro.build) + Tailwind CSS v4 y JavaScript vanilla (sin framework de UI) para mantenerlo extremadamente liviano y rápido en móvil.

## Stack

- **Astro** (salida estática) — cada página se genera como HTML, con islas de JS mínimas solo donde hay interactividad real (carrito, filtros, menú móvil).
- **Tailwind CSS v4** — tokens de marca definidos en `src/styles/global.css` (`@theme`).
- **Carrito** — `src/scripts/cart.ts`, un store pequeño respaldado por `localStorage`, sin dependencias.
- Fuentes autoalojadas (`@fontsource-variable/*`) — sin llamadas a Google Fonts en producción.

## Estructura de datos (editable sin tocar diseño)

- `src/data/site.ts` — WhatsApp, PedidosYa, redes sociales, horario.
- `src/data/products.ts` — catálogo completo. **Los precios están en `null` a propósito** ("Precio próximamente") hasta que se confirmen; para agregar un precio real solo hay que poner el número en Lempiras. Para agregar un producto nuevo, se copia el patrón de cualquier entrada existente.
- `src/data/testimonials.ts` — reseñas reales de Google (verificadas contra la ficha de Google Maps del negocio). No agregar reseñas que no se puedan verificar.

## Comandos

| Comando           | Acción                                      |
| :----------------- | :------------------------------------------ |
| `npm install`       | Instala dependencias                        |
| `npm run dev`       | Servidor de desarrollo en `localhost:4321`  |
| `npm run build`     | Build de producción a `./dist/`             |
| `npm run preview`   | Sirve el build de producción localmente     |

## Antes de publicar

1. Actualizar `site` en `astro.config.mjs` con el dominio final (hoy tiene un placeholder: `https://www.soadbakery.com`) y `Sitemap:` en `public/robots.txt`.
2. Confirmar precios en `src/data/products.ts`.
3. Confirmar horarios/método de pago de la vending machine en `src/components/VendingFeature.astro` cuando estén definidos.
