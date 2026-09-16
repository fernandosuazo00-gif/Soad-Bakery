import type { ImageMetadata } from "astro";

import boxCookie from "../assets/gallery/cookie-box.jpg";
import boxSummer from "../assets/gallery/summer-box.jpg";
import boxMini from "../assets/gallery/mini-box.jpg";

import cakeGuayaba from "../assets/gallery/guayaba-cake.jpg";
import cakeRedVelvet from "../assets/gallery/red-velvet-cake.jpg";
import cakeNutella from "../assets/gallery/nutella-cake.jpg";
import cakeBlueberryPistachio from "../assets/gallery/blueberry-pistachio-cake.jpg";
import cakeMatilda from "../assets/gallery/matilda-cake.jpg";
import cakeCaramelo from "../assets/gallery/caramelo-cake.jpg";

import sliceBlueberryPistachio from "../assets/gallery/slice-blueberry-pistachio.jpg";
import sliceCaramelo from "../assets/gallery/slice-caramelo.jpg";
import sliceChocolate from "../assets/gallery/slice-chocolate.jpg";

import bakeryBrownies from "../assets/gallery/brownies.jpg";
import bakeryStrawberryShortcake from "../assets/gallery/strawberry-shortcake.jpg";
import bakeryTiramisuCoco from "../assets/gallery/tiramisu-coco.jpg";
import bakerySnickersCookie from "../assets/gallery/snickers-cookie.jpg";

/**
 * Category slugs mirror SOAD Bakery's existing WhatsApp catalog so the
 * website and the WhatsApp order flow stay in sync.
 */
export const categories = [
  { id: "todos", label: "All Items" },
  { id: "boxes", label: "Boxes" },
  { id: "cakes-cheesecakes", label: "Cakes and Cheesecakes" },
  { id: "bakery", label: "Bakery" },
  { id: "slices", label: "Slices" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export interface Product {
  id: string;
  name: string;
  category: Exclude<CategoryId, "todos">;
  /** Price in Honduran Lempiras. `null` = "próximamente" until confirmed. */
  price: number | null;
  description: string;
  image: ImageMetadata;
  alt: string;
  /** Set true for a handful of hero-worthy items used in featured rails. */
  featured?: boolean;
}

// Prices are intentionally left as `null` (shown as "Precio próximamente")
// until SOAD Bakery confirms them. Do not invent numbers here — just
// fill in the Lempira amount per item when it's ready.
export const products: Product[] = [
  // ---- Boxes ----
  {
    id: "box-cookies",
    name: "Cookie Box",
    category: "boxes",
    price: null,
    description:
      "Caja surtida de galletas artesanales rellenas — pistacho, maracuyá, coco y chocolate — envuelta a mano con cordel de yute.",
    image: boxCookie,
    alt: "Caja de galletas artesanales SOAD Bakery envuelta con cordel, con sabores de pistacho, maracuyá y coco",
    featured: true,
  },
  {
    id: "box-summer",
    name: "Summer Box",
    category: "boxes",
    price: null,
    description:
      "Selección de mini postres de temporada — tartaletas, cupcakes y bocados de chocolate — lista para regalar.",
    image: boxSummer,
    alt: "Summer Box de SOAD Bakery con mini tartaletas y postres surtidos, amarrada con listón rojo",
  },
  {
    id: "box-mini",
    name: "Mini Box",
    category: "boxes",
    price: null,
    description:
      "El gift box perfecto para un antojo pequeño: brownie, alfajor, tartaleta y cupcake en una presentación compacta.",
    image: boxMini,
    alt: "Mini Box de SOAD Bakery con brownie, alfajor y tartaleta, amarrada con listón rojo",
  },

  // ---- Cakes and Cheesecakes ----
  {
    id: "cake-guayaba",
    name: "Pastel de Guayaba",
    category: "cakes-cheesecakes",
    price: null,
    description:
      "Bizcocho suave relleno de guayaba, terminado en un naked cake con rosetones de chantilly.",
    image: cakeGuayaba,
    alt: "Pastel de guayaba estilo naked cake con rosetones de chantilly, decorado por el equipo de SOAD Bakery",
    featured: true,
  },
  {
    id: "cake-red-velvet",
    name: "Red Velvet Cake",
    category: "cakes-cheesecakes",
    price: null,
    description:
      "Clásico red velvet con frosting de queso crema, coronado con un jardín de fresas, moras y blackberries frescas.",
    image: cakeRedVelvet,
    alt: "Red Velvet Cake de SOAD Bakery coronado con fresas, moras y blackberries frescas",
  },
  {
    id: "cake-nutella",
    name: "Nutella Cake",
    category: "cakes-cheesecakes",
    price: null,
    description:
      "Capas húmedas de chocolate con crema de Nutella, drip de chocolate y copetes generosos encima.",
    image: cakeNutella,
    alt: "Nutella Cake de SOAD Bakery con drip de chocolate y copetes de crema de Nutella",
    featured: true,
  },
  {
    id: "cake-blueberry-pistachio",
    name: "Blueberry Pistachio Cake",
    category: "cakes-cheesecakes",
    price: null,
    description:
      "Frosting de mora silvestre, corona de blueberries frescos y pistacho molido tostado en el centro.",
    image: cakeBlueberryPistachio,
    alt: "Blueberry Pistachio Cake de SOAD Bakery con blueberries frescos y pistacho molido",
  },
  {
    id: "cake-matilda",
    name: "Matilda Cake",
    category: "cakes-cheesecakes",
    price: null,
    description:
      "Chocolate intenso cubierto en drip y trozos de brownie encima — el favorito de quienes aman el chocolate sin límites.",
    image: cakeMatilda,
    alt: "Matilda Cake de chocolate de SOAD Bakery con drip y trozos de brownie encima",
  },
  {
    id: "cake-caramelo",
    name: "Caramelo Cake",
    category: "cakes-cheesecakes",
    price: null,
    description:
      "Bizcocho de almendra bañado en caramelo, con borde de almendras fileteadas y frosting de vainilla.",
    image: cakeCaramelo,
    alt: "Caramelo Cake de SOAD Bakery bañado en caramelo con borde de almendras fileteadas",
  },

  // ---- Slices ----
  {
    id: "slice-blueberry-pistachio",
    name: "Rebanada Blueberry Pistachio",
    category: "slices",
    price: null,
    description: "Una porción individual de nuestro Blueberry Pistachio Cake.",
    image: sliceBlueberryPistachio,
    alt: "Rebanada individual de Blueberry Pistachio Cake de SOAD Bakery",
  },
  {
    id: "slice-caramelo",
    name: "Rebanada Caramelo",
    category: "slices",
    price: null,
    description: "Una porción individual de nuestro Caramelo Cake.",
    image: sliceCaramelo,
    alt: "Rebanada individual de Caramelo Cake de SOAD Bakery bañada en caramelo",
  },
  {
    id: "slice-chocolate",
    name: "Rebanada de Chocolate",
    category: "slices",
    price: null,
    description: "Una porción individual de nuestro pastel de chocolate con drip.",
    image: sliceChocolate,
    alt: "Rebanada individual de pastel de chocolate de SOAD Bakery con drip de chocolate",
  },

  // ---- Bakery ----
  {
    id: "bakery-brownies",
    name: "Brownies",
    category: "bakery",
    price: null,
    description: "Brownies de chocolate fudgy, húmedos por dentro y con costra crujiente.",
    image: bakeryBrownies,
    alt: "Brownies de chocolate apilados de SOAD Bakery",
    featured: true,
  },
  {
    id: "bakery-strawberry-shortcake",
    name: "Vasito Strawberry Shortcake",
    category: "bakery",
    price: null,
    description:
      "Capas de bizcocho, chantilly y fresa fresca en un vasito individual listo para llevar.",
    image: bakeryStrawberryShortcake,
    alt: "Vasito individual de Strawberry Shortcake de SOAD Bakery con capas de fresa y chantilly",
  },
  {
    id: "bakery-tiramisu-coco",
    name: "Tiramisú de Coco",
    category: "bakery",
    price: null,
    description:
      "Nuestro tiramisú con un giro tropical: capas de coco tostado y crema suave en formato individual.",
    image: bakeryTiramisuCoco,
    alt: "Vasito individual de Tiramisú de Coco de SOAD Bakery con capas de coco tostado",
  },
  {
    id: "bakery-snickers-cookie",
    name: "Snickers Cookie",
    category: "bakery",
    price: null,
    description:
      "Galleta suave coronada con frosting de chocolate y trozos de Snickers.",
    image: bakerySnickersCookie,
    alt: "Snickers Cookie de SOAD Bakery con frosting de chocolate y trozos de Snickers",
  },
];

export const getProductsByCategory = (category: CategoryId): Product[] =>
  category === "todos" ? products : products.filter((p) => p.category === category);

export const featuredProducts = products.filter((p) => p.featured);

export { formatLempiras } from "../lib/currency";
