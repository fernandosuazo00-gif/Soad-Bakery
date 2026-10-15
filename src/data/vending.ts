import type { ImageMetadata } from "astro";

import blueberryLemonTrifle from "../assets/vending/blueberry-lemon-trifle.jpg";
import mini4Leches from "../assets/vending/mini-4-leches.jpg";
import tiramisuCafe from "../assets/vending/tiramisu-cafe-individual.jpg";
import keyLimeTart from "../assets/vending/key-lime-tart.jpg";
import dubaiCookies from "../assets/vending/dubai-chocolate-cookies.jpg";
import tartaletaFrutosRojos from "../assets/vending/tartaleta-frutos-rojos.jpg";
import chocolateChipCookies from "../assets/vending/chocolate-chip-cookies-nueces.jpg";
import matildaSlice from "../assets/vending/matilda-slice.jpg";
import selvaNegraSlice from "../assets/vending/selva-negra-slice.jpg";
import zanahoriaSlice from "../assets/vending/zanahoria-slice.jpg";
import blackberryLemonSlice from "../assets/vending/blackberry-lemon-slice.jpg";
import brownies from "../assets/vending/brownies.jpg";

export interface VendingItem {
  name: string;
  image: ImageMetadata;
  alt: string;
}

// Real photos of products sold in the vending machine. Only names are shown:
// prices, stock and descriptions live in the vending WhatsApp catalog, which
// is the source of truth (and changes more often than this site). These are
// intentionally separate from the main catalog / cart.
export const vendingItems: VendingItem[] = [
  { name: "Mini 4 leches", image: mini4Leches, alt: "Mini 4 leches en envase individual de aluminio" },
  { name: "Tiramisú de café individual", image: tiramisuCafe, alt: "Tiramisú de café individual en vasito transparente" },
  { name: "Blueberry lemon trifle", image: blueberryLemonTrifle, alt: "Blueberry lemon trifle en vasito con capas de blueberry y limón" },
  { name: "Key lime tart", image: keyLimeTart, alt: "Key lime tart en forma de corazón con crema y pistacho" },
  { name: "Tartaleta de frutos rojos", image: tartaletaFrutosRojos, alt: "Tartaleta de frutos rojos con fresas, moras y arándanos" },
  { name: "Dubai chocolate cookies", image: dubaiCookies, alt: "Dubai chocolate cookies rellenas de kataifi" },
  { name: "Chocolate chip cookies con nueces", image: chocolateChipCookies, alt: "Chocolate chip cookies con nueces apiladas" },
  { name: "Brownies", image: brownies, alt: "Mini brownies de chocolate apilados" },
  { name: "Matilda slice", image: matildaSlice, alt: "Rebanada de Matilda cake de chocolate con trozos de brownie" },
  { name: "Selva negra slice", image: selvaNegraSlice, alt: "Rebanada de pastel selva negra con cerezas" },
  { name: "Zanahoria slice", image: zanahoriaSlice, alt: "Rebanada de pastel de zanahoria relleno de cheesecake" },
  { name: "Blackberry lemon slice", image: blackberryLemonSlice, alt: "Rebanada de pastel de mora con relleno de limón" },
];
