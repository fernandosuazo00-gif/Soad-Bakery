import type { ImageMetadata } from "astro";

// ---- Boxes ----
import boxSummer from "../assets/menu/box-summer.jpg";
import boxThankYou from "../assets/menu/box-thank-you.jpg";
import boxCookie from "../assets/menu/box-cookie.jpg";
import boxSpring from "../assets/menu/box-spring.jpg";
import boxMini from "../assets/menu/box-mini.jpg";

// ---- Fall Season ----
import fallBox from "../assets/menu/fall-box.jpg";
import fallBrownieMerengue from "../assets/menu/fall-brownie-merengue.jpg";
import fallTartaPecanas from "../assets/menu/fall-tarta-pecanas.jpg";
import fallMiniPecanTart from "../assets/menu/fall-mini-pecan-tart.jpg";
import fallPecanPieCake from "../assets/menu/fall-pecan-pie-cake.jpg";
import fallMiniBundtManzana from "../assets/menu/fall-mini-bundt-manzana.jpg";

// ---- Cakes and Cheesecakes ----
import cakeBlackberryLemon8p from "../assets/menu/cake-blackberry-lemon-8p.jpg";
import cakeBirthday from "../assets/menu/cake-birthday.jpg";
import cakeAlmendraCaramelo8p from "../assets/menu/cake-almendra-caramelo-8p.jpg";
import cakeBlackberryLemon from "../assets/menu/cake-blackberry-lemon.jpg";
import cakeStrawberryShortcakeFamiliar from "../assets/menu/cake-strawberry-shortcake-familiar.jpg";
import cakeBrazoGitanoChilena from "../assets/menu/cake-brazo-gitano-chilena.jpg";
import cakeTiramisuCafe from "../assets/menu/cake-tiramisu-cafe.jpg";
import cakeNutella from "../assets/menu/cake-nutella.jpg";
import cakeGermanChocolate from "../assets/menu/cake-german-chocolate.jpg";
import cakeBlackberryLemonFamiliar from "../assets/menu/cake-blackberry-lemon-familiar.jpg";
import cakePinaColada from "../assets/menu/cake-pina-colada.jpg";
import cakeRedVelvet from "../assets/menu/cake-red-velvet.jpg";
import cheesecakeMiniTurtle from "../assets/menu/cheesecake-mini-turtle.jpg";
import cakeChocoflanGrande from "../assets/menu/cake-chocoflan-grande.jpg";
import cake4Leches from "../assets/menu/cake-4-leches.jpg";
import cakeZanahoriaCheesecake from "../assets/menu/cake-zanahoria-cheesecake.jpg";
import tartaFrutosRojosGrande from "../assets/menu/tarta-frutos-rojos-grande.jpg";
import cheesecakeMiniBlueberryLemon from "../assets/menu/cheesecake-mini-blueberry-lemon.jpg";
import cakeBerryAlmond from "../assets/menu/cake-berry-almond.jpg";
import cakeMaracuya from "../assets/menu/cake-maracuya.jpg";
import cakeAlmendraCarameloFamiliar from "../assets/menu/cake-almendra-caramelo-familiar.jpg";
import cheesecakeMiniFresas from "../assets/menu/cheesecake-mini-fresas.jpg";
import cheesecakeFresas from "../assets/menu/cheesecake-fresas.jpg";
import cheesecakeBrownieCapuccino from "../assets/menu/cheesecake-brownie-capuccino.jpg";
import cheesecakeBlueberryLemon from "../assets/menu/cheesecake-blueberry-lemon.jpg";
import cakeBlueberryPistachoFamiliar from "../assets/menu/cake-blueberry-pistacho-familiar.jpg";
import cakeMatildaFamiliar from "../assets/menu/cake-matilda-familiar.jpg";
import cakeGuayabaFamiliar from "../assets/menu/cake-guayaba-familiar.jpg";

// ---- Bakery ----
import bakeryMiniChocoflan from "../assets/menu/bakery-mini-chocoflan.jpg";
import bakeryMini4Leches from "../assets/menu/bakery-mini-4-leches.jpg";
import bakeryTiramisuIndividualCafe from "../assets/menu/bakery-tiramisu-individual-cafe.jpg";
import bakeryGalletasGuayabaQueso from "../assets/menu/bakery-galletas-guayaba-queso.jpg";
import bakeryRedVelvetChipCookies from "../assets/menu/bakery-red-velvet-chip-cookies.jpg";
import bakeryGalletasAlmendraChocolateBlanco from "../assets/menu/bakery-galletas-almendra-chocolate-blanco.jpg";
import bakeryLaBomba from "../assets/menu/bakery-la-bomba.jpg";
import bakeryCremeBrulee from "../assets/menu/bakery-creme-brulee.jpg";
import bakeryBrownies from "../assets/menu/bakery-brownies.jpg";
import bakeryDubaiCookies from "../assets/menu/bakery-dubai-cookies.jpg";
import bakeryTartaletaFrutosRojos from "../assets/menu/bakery-tartaleta-frutos-rojos.jpg";
import bakeryMiniKeyLimeTart from "../assets/menu/bakery-mini-key-lime-tart.jpg";
import bakeryChilenas from "../assets/menu/bakery-chilenas.jpg";
import bakeryChocolateChips from "../assets/menu/bakery-chocolate-chips.jpg";
import bakeryBlueberryLemonTrifle from "../assets/menu/bakery-blueberry-lemon-trifle.jpg";
import bakeryTiramisuCoco from "../assets/menu/bakery-tiramisu-coco.jpg";
import bakeryMiniMousseMaracuya from "../assets/menu/bakery-mini-mousse-maracuya.jpg";

// ---- Slices ----
import sliceBlackberryLemon from "../assets/menu/slice-blackberry-lemon.jpg";
import sliceZanahoria from "../assets/menu/slice-zanahoria.jpg";
import sliceSelvaNegra from "../assets/menu/slice-selva-negra.jpg";

/**
 * Category slugs mirror SOAD Bakery's WhatsApp catalog (see the `Menu`
 * folder of source screenshots) so the website and the WhatsApp order
 * flow stay in sync.
 */
export const categories = [
  { id: "todos", label: "All Items" },
  { id: "boxes", label: "Boxes" },
  { id: "cakes-cheesecakes", label: "Cakes and Cheesecakes" },
  { id: "fall-season", label: "Fall Season" },
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

// Source of truth: SOAD Bakery's WhatsApp catalog screenshots (see the
// `Menu` folder). Names, prices and descriptions are transcribed as shown
// there — do not invent or alter numbers/wording here. When the catalog
// changes, update this file (and re-crop product photos into
// src/assets/menu/ from fresh screenshots) rather than the components.
export const products: Product[] = [
  // ================= Boxes =================
  {
    id: "box-summer",
    name: "Summer Box",
    category: "boxes",
    price: 745,
    description:
      "2 pies individuales de limón, 3 red velvet chocolate chips cookies, 3 galletas de cranberry, almendra y chocolate chips, 6 mini brownies y 3 chilenas.",
    image: boxSummer,
    alt: "Summer Box de SOAD Bakery con cookies, brownies y chilenas surtidas",
  },
  {
    id: "box-thank-you",
    name: "Thank You Box",
    category: "boxes",
    price: 645,
    description: "8 mini brownies, 4 rice krispies, 3 chocolate chip con nueces y 6 mini chilenas.",
    image: boxThankYou,
    alt: "Thank You Box de SOAD Bakery con mini brownies, rice krispies y chilenas",
  },
  {
    id: "box-cookie",
    name: "Cookie Box",
    category: "boxes",
    price: 545,
    description:
      "6 galletas de sabores: galleta de guayaba y queso, snickers cookie, chocolate nutella cookie, coconut brigadeiro cookie, galleta de…",
    image: boxCookie,
    alt: "Cookie Box de SOAD Bakery con seis galletas de sabores surtidos",
    featured: true,
  },
  {
    id: "box-spring",
    name: "Spring Box",
    category: "boxes",
    price: 745,
    description:
      "1 mini cheesecake de fresas para 3 personas, 3 galletas de almendra y chocolate blanco, 3 baklawes y 1 mini mousse de maracuyá.",
    image: boxSpring,
    alt: "Spring Box de SOAD Bakery con mini cheesecake de fresas, baklawes y mousse de maracuyá",
  },
  {
    id: "box-mini",
    name: "Mini Box",
    category: "boxes",
    price: 465,
    description: "6 brownies, 2 chilenas, 1 crème brûlée.",
    image: boxMini,
    alt: "Mini Box de SOAD Bakery con brownies, chilenas y crème brûlée",
  },

  // ================= Fall Season =================
  {
    id: "fall-box",
    name: "Fall Box",
    category: "fall-season",
    price: 695,
    description: "Mini brownie merengue, 3 chilenas, 1 mini bundt de manzana y 2 mini pecan tart.",
    image: fallBox,
    alt: "Fall Box de SOAD Bakery con brownie merengue, chilenas, bundt de manzana y pecan tart",
    featured: true,
  },
  {
    id: "fall-brownie-merengue",
    name: "Brownie Merengue",
    category: "fall-season",
    price: 745,
    description:
      "Base de brownie con brigadeiro, dulce de leche y merengue de marshmallow, decorado con líneas de ganache y almendra.",
    image: fallBrownieMerengue,
    alt: "Brownie Merengue de SOAD Bakery con merengue de marshmallow y ganache",
  },
  {
    id: "fall-tarta-pecanas",
    name: "Tarta de Pecanas",
    category: "fall-season",
    price: 895,
    description: "Para 8/10 personas.",
    image: fallTartaPecanas,
    alt: "Tarta de Pecanas de SOAD Bakery decorada con chantilly",
  },
  {
    id: "fall-mini-pecan-tart",
    name: "Mini Pecan Tart",
    category: "fall-season",
    price: 125,
    description: "Mini tarta de pecanas individual.",
    image: fallMiniPecanTart,
    alt: "Mini Pecan Tart individual de SOAD Bakery",
  },
  {
    id: "fall-pecan-pie-cake",
    name: "Pecan Pie Cake",
    category: "fall-season",
    price: 695,
    description: "Pastel de vainilla relleno con pie de pecanas, para 6 personas.",
    image: fallPecanPieCake,
    alt: "Pecan Pie Cake de SOAD Bakery con relleno de pie de pecanas",
  },
  {
    id: "fall-mini-bundt-manzana",
    name: "Mini Bundt de Manzana",
    category: "fall-season",
    price: 135,
    description: "Mini bundt de manzana y nuez con relleno de cheesecake (contiene pecanas).",
    image: fallMiniBundtManzana,
    alt: "Mini Bundt de Manzana de SOAD Bakery con nuez y relleno de cheesecake",
  },

  // ================= Cakes and Cheesecakes =================
  {
    id: "cake-blackberry-lemon-8p",
    name: "BlackBerry Lemon 8 Personas",
    category: "cakes-cheesecakes",
    price: 795,
    description: "Torta de mora relleno de crema de limón con pistacho de decoración. Para 8 personas.",
    image: cakeBlackberryLemon8p,
    alt: "BlackBerry Lemon Cake de SOAD Bakery para 8 personas, decorado con moras y pistacho",
  },
  {
    id: "cake-birthday",
    name: "Birthday Cake",
    category: "cakes-cheesecakes",
    price: 645,
    description: "Torta de vainilla con confetti relleno de dulce de leche. Para 5 personas.",
    image: cakeBirthday,
    alt: "Birthday Cake de SOAD Bakery con confetti y sprinkles, relleno de dulce de leche",
  },
  {
    id: "cake-almendra-caramelo-8p",
    name: "Almendra Caramelo 8 Personas",
    category: "cakes-cheesecakes",
    price: 795,
    description: "Torta de almendra relleno de dulce de leche. Para 8 personas.",
    image: cakeAlmendraCaramelo8p,
    alt: "Torta de Almendra Caramelo de SOAD Bakery para 8 personas",
  },
  {
    id: "cake-blackberry-lemon",
    name: "BlackBerry Lemon Cake",
    category: "cakes-cheesecakes",
    price: 645,
    description: "Torta de mora relleno de crema de limón con pistacho de decoración. Para 5 personas.",
    image: cakeBlackberryLemon,
    alt: "BlackBerry Lemon Cake de SOAD Bakery para 5 personas",
  },
  {
    id: "cake-strawberry-shortcake-familiar",
    name: "Strawberry Shortcake Familiar",
    category: "cakes-cheesecakes",
    price: 1395,
    description: "Strawberry shortcake relleno de fresas con crema y torta de vainilla. Para 12 personas.",
    image: cakeStrawberryShortcakeFamiliar,
    alt: "Strawberry Shortcake Familiar de SOAD Bakery con capas de fresa y crema, para 12 personas",
  },
  {
    id: "cake-brazo-gitano-chilena",
    name: "Brazo Gitano de Chilena",
    category: "cakes-cheesecakes",
    price: 1295,
    description: "Relleno de dulce de leche y crema pastelera. Para 12 personas.",
    image: cakeBrazoGitanoChilena,
    alt: "Brazo Gitano de Chilena de SOAD Bakery relleno de dulce de leche",
  },
  {
    id: "cake-tiramisu-cafe",
    name: "Tiramisú de Café",
    category: "cakes-cheesecakes",
    price: 1295,
    description: "Tiramisú tradicional con trufas. 8-10 personas.",
    image: cakeTiramisuCafe,
    alt: "Tiramisú de Café de SOAD Bakery decorado con trufas de chocolate",
  },
  {
    id: "cake-nutella",
    name: "Nutella Cake",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Pastel de chocolate relleno de mousse de chocolate oscuro y Nutella. Para 5-6 personas.",
    image: cakeNutella,
    alt: "Nutella Cake de SOAD Bakery con drip de chocolate y Nutella",
    featured: true,
  },
  {
    id: "cake-german-chocolate",
    name: "Germán Chocolate Cake",
    category: "cakes-cheesecakes",
    price: 645,
    description: "Pastel de chocolate relleno de leche condensada, coco y pecanas. Para 4-5 personas.",
    image: cakeGermanChocolate,
    alt: "Germán Chocolate Cake de SOAD Bakery con coco y pecanas",
  },
  {
    id: "cake-blackberry-lemon-familiar",
    name: "BlackBerry Lemon Familiar",
    category: "cakes-cheesecakes",
    price: 1595,
    description: "Pastel de mora relleno con salsa de limón. Para 12 a 15 personas.",
    image: cakeBlackberryLemonFamiliar,
    alt: "BlackBerry Lemon Familiar de SOAD Bakery para 12 a 15 personas",
  },
  {
    id: "cake-pina-colada",
    name: "Piña Colada Cake",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Pastel de coco relleno de salsa de piña y apanado de coco. Para 5-6 personas.",
    image: cakePinaColada,
    alt: "Piña Colada Cake de SOAD Bakery con coco tostado y cerezas",
  },
  {
    id: "cake-red-velvet",
    name: "Red Velvet",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Pastel de red velvet relleno con mousse de chocolate blanco y frutos rojos. Para 4-5 personas.",
    image: cakeRedVelvet,
    alt: "Red Velvet de SOAD Bakery con frutos rojos y mousse de chocolate blanco",
  },
  {
    id: "cheesecake-mini-turtle",
    name: "Mini Turtle Cheesecake",
    category: "cakes-cheesecakes",
    price: 465,
    description: "Base de brownie con cheesecake, pecanas, caramelo y chocolate. Para 2-3 personas.",
    image: cheesecakeMiniTurtle,
    alt: "Mini Turtle Cheesecake de SOAD Bakery con pecanas y caramelo",
  },
  {
    id: "cake-chocoflan-grande",
    name: "Chocoflan Grande",
    category: "cakes-cheesecakes",
    price: 695,
    description: "Chocoflan grande para 5-6 personas, contiene almendra encima.",
    image: cakeChocoflanGrande,
    alt: "Chocoflan Grande de SOAD Bakery con almendras encima",
  },
  {
    id: "cake-4-leches",
    name: "4 Leches",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Tres leches tradicional con dulce de leche. Para 8 personas.",
    image: cake4Leches,
    alt: "Pastel 4 Leches de SOAD Bakery con dulce de leche",
  },
  {
    id: "cake-zanahoria-cheesecake",
    name: "Zanahoria Relleno de Cheesecake",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Torta de zanahoria con lustre de mantequilla relleno de cheesecake. Para 6 personas.",
    image: cakeZanahoriaCheesecake,
    alt: "Torta de Zanahoria de SOAD Bakery rellena de cheesecake, con almendras y coco",
  },
  {
    id: "tarta-frutos-rojos-grande",
    name: "Tarta de Frutos Rojos",
    category: "cakes-cheesecakes",
    price: 945,
    description: "Tarta de frutos rojos con crema pastelera. Para 8-10 personas.",
    image: tartaFrutosRojosGrande,
    alt: "Tarta de Frutos Rojos de SOAD Bakery con fresas y moras",
  },
  {
    id: "cheesecake-mini-blueberry-lemon",
    name: "Mini Blueberry Lemon Cheesecake",
    category: "cakes-cheesecakes",
    price: 465,
    description:
      "Cheesecake de arándanos con crema de limón, mousse de chocolate blanco y arándanos. Para 2-3 personas.",
    image: cheesecakeMiniBlueberryLemon,
    alt: "Mini Blueberry Lemon Cheesecake de SOAD Bakery con arándanos frescos",
  },
  {
    id: "cake-berry-almond",
    name: "Berry Almond",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Torta de almendra con relleno de salsa de frutos rojos y mousse de chocolate blanco. Para 5-6 personas.",
    image: cakeBerryAlmond,
    alt: "Berry Almond de SOAD Bakery con fresas, moras y arándanos frescos",
  },
  {
    id: "cake-maracuya",
    name: "Maracuyá Cake",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Pastel maracuyá con relleno de crema de maracuyá. 4 a 5 personas.",
    image: cakeMaracuya,
    alt: "Maracuyá Cake de SOAD Bakery con relleno de crema de maracuyá",
  },
  {
    id: "cake-almendra-caramelo-familiar",
    name: "Almendra Caramelo Familiar",
    category: "cakes-cheesecakes",
    price: 1595,
    description: "Pastel de torta de almendra con relleno de dulce de leche. 12-15 personas.",
    image: cakeAlmendraCarameloFamiliar,
    alt: "Almendra Caramelo Familiar de SOAD Bakery para 12 a 15 personas",
  },
  {
    id: "cheesecake-mini-fresas",
    name: "Mini Cheesecake de Fresas",
    category: "cakes-cheesecakes",
    price: 465,
    description: "Mini cheesecake con fresas. Para 2-3 personas.",
    image: cheesecakeMiniFresas,
    alt: "Mini Cheesecake de Fresas de SOAD Bakery",
  },
  {
    id: "cheesecake-fresas",
    name: "Cheesecake de Fresas",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Cheesecake clásico con fresa y mermelada. Para 6 personas.",
    image: cheesecakeFresas,
    alt: "Cheesecake de Fresas clásico de SOAD Bakery",
  },
  {
    id: "cheesecake-brownie-capuccino",
    name: "Brownie Capuccino",
    category: "cakes-cheesecakes",
    price: 745,
    description: "Delicioso cheesecake de capuchino con capa de brownie. Para 6 personas.",
    image: cheesecakeBrownieCapuccino,
    alt: "Cheesecake Brownie Capuccino de SOAD Bakery",
  },
  {
    id: "cheesecake-blueberry-lemon",
    name: "Blueberry Lemon Cheesecake",
    category: "cakes-cheesecakes",
    price: 1695,
    description: "Cheesecake con crema de limón y arándanos. Para 12 personas.",
    image: cheesecakeBlueberryLemon,
    alt: "Blueberry Lemon Cheesecake de SOAD Bakery para 12 personas",
  },
  {
    id: "cake-blueberry-pistacho-familiar",
    name: "Blueberry Pistacho Familiar",
    category: "cakes-cheesecakes",
    price: 1695,
    description: "Pastel de torta de pistacho relleno con salsa de arándanos. Para 15 personas.",
    image: cakeBlueberryPistachoFamiliar,
    alt: "Blueberry Pistacho Familiar de SOAD Bakery para 15 personas",
  },
  {
    id: "cake-matilda-familiar",
    name: "Matilda Cake Familiar",
    category: "cakes-cheesecakes",
    price: 1795,
    description:
      "Torta de chocolate relleno de pudín de chocolate, con lustre de chocolate decorado con trozos de brownie. Para 15 personas.",
    image: cakeMatildaFamiliar,
    alt: "Matilda Cake Familiar de SOAD Bakery con topper y trozos de brownie",
    featured: true,
  },
  {
    id: "cake-guayaba-familiar",
    name: "Guayaba Cake Familiar",
    category: "cakes-cheesecakes",
    price: 1695,
    description: "Torta de vainilla con relleno de guayaba y queso crema. Para 15 personas.",
    image: cakeGuayabaFamiliar,
    alt: "Guayaba Cake Familiar de SOAD Bakery para 15 personas",
  },

  // ================= Bakery =================
  {
    id: "bakery-mini-chocoflan",
    name: "Mini Chocoflan",
    category: "bakery",
    price: 130,
    description: "Chocoflan individual con almendras.",
    image: bakeryMiniChocoflan,
    alt: "Mini Chocoflan individual de SOAD Bakery con almendras",
  },
  {
    id: "bakery-mini-4-leches",
    name: "Mini 4 Leches",
    category: "bakery",
    price: 125,
    description: "4 leches porción individual.",
    image: bakeryMini4Leches,
    alt: "Mini 4 Leches porción individual de SOAD Bakery",
  },
  {
    id: "bakery-tiramisu-individual-cafe",
    name: "Tiramisú Individual de Café",
    category: "bakery",
    price: 195,
    description: "Tiramisú tradicional de café.",
    image: bakeryTiramisuIndividualCafe,
    alt: "Tiramisú Individual de Café de SOAD Bakery",
  },
  {
    id: "bakery-galletas-guayaba-queso",
    name: "Galletas de Guayaba y Queso",
    category: "bakery",
    price: 260,
    description: "Bolsa de 6 galletas de guayaba y queso.",
    image: bakeryGalletasGuayabaQueso,
    alt: "Galletas de Guayaba y Queso de SOAD Bakery, bolsa de 6 unidades",
  },
  {
    id: "bakery-red-velvet-chip-cookies",
    name: "Red Velvet Chip Cookies",
    category: "bakery",
    price: 260,
    description: "Bolsa de 6 galletas.",
    image: bakeryRedVelvetChipCookies,
    alt: "Red Velvet Chip Cookies de SOAD Bakery, bolsa de 6 galletas",
  },
  {
    id: "bakery-galletas-almendra-chocolate-blanco",
    name: "Galletas de Almendra y Chocolate Blanco",
    category: "bakery",
    price: 285,
    description: "Bolsa de galletas de almendra y chocolate blanco (6 unidades).",
    image: bakeryGalletasAlmendraChocolateBlanco,
    alt: "Galletas de Almendra y Chocolate Blanco de SOAD Bakery, bolsa de 6 unidades",
  },
  {
    id: "bakery-la-bomba",
    name: "La Bomba Dessert",
    category: "bakery",
    price: 175,
    description: "Tres leches con trozos de chilena y pedacitos de brownie con dulce de leche.",
    image: bakeryLaBomba,
    alt: "La Bomba Dessert de SOAD Bakery en vasito individual",
  },
  {
    id: "bakery-creme-brulee",
    name: "Crème Brûlée",
    category: "bakery",
    price: 130,
    description: "Postre tradicional de la repostería francesa.",
    image: bakeryCremeBrulee,
    alt: "Crème Brûlée individual de SOAD Bakery",
  },
  {
    id: "bakery-brownies",
    name: "Brownies",
    category: "bakery",
    price: 260,
    description: "Bolsa de brownies (8 unidades).",
    image: bakeryBrownies,
    alt: "Bolsa de Brownies de SOAD Bakery, 8 unidades",
  },
  {
    id: "bakery-dubai-cookies",
    name: "Dubai Cookies",
    category: "bakery",
    price: 195,
    description: "Dos galletas de chocolate con relleno de kataifi.",
    image: bakeryDubaiCookies,
    alt: "Dubai Cookies de SOAD Bakery con relleno de kataifi",
  },
  {
    id: "bakery-tartaleta-frutos-rojos",
    name: "Tartaleta de Frutos Rojos",
    category: "bakery",
    price: 115,
    description: "Tartaleta de crema pastelera con frutos rojos.",
    image: bakeryTartaletaFrutosRojos,
    alt: "Tartaleta de Frutos Rojos individual de SOAD Bakery",
  },
  {
    id: "bakery-mini-key-lime-tart",
    name: "Mini Key Lime Tart",
    category: "bakery",
    price: 115,
    description: "Tartaleta de limón con pistachos.",
    image: bakeryMiniKeyLimeTart,
    alt: "Mini Key Lime Tart de SOAD Bakery con pistachos",
  },
  {
    id: "bakery-chilenas",
    name: "Chilenas",
    category: "bakery",
    price: 260,
    description: "Bolsa de 6 chilenas.",
    image: bakeryChilenas,
    alt: "Chilenas de SOAD Bakery, bolsa de 6 unidades",
  },
  {
    id: "bakery-chocolate-chips",
    name: "Chocolate Chips",
    category: "bakery",
    price: 260,
    description: "Bolsa de galletas de chocolate (6 unidades).",
    image: bakeryChocolateChips,
    alt: "Galletas Chocolate Chips de SOAD Bakery, bolsa de 6 unidades",
  },
  {
    id: "bakery-blueberry-lemon-trifle",
    name: "Blueberry Lemon Trifle",
    category: "bakery",
    price: 175,
    description: "Deliciosos blueberry con salsa de limón.",
    image: bakeryBlueberryLemonTrifle,
    alt: "Blueberry Lemon Trifle individual de SOAD Bakery",
  },
  {
    id: "bakery-tiramisu-coco",
    name: "Tiramisú de Coco",
    category: "bakery",
    price: 175,
    description: "Tiramisú de coco, versión tropical del clásico italiano.",
    image: bakeryTiramisuCoco,
    alt: "Vasito individual de Tiramisú de Coco de SOAD Bakery",
  },
  {
    id: "bakery-mini-mousse-maracuya",
    name: "Mini Mousse de Maracuyá",
    category: "bakery",
    price: 95,
    description: "Deliciosa tarta individual de mousse de maracuyá.",
    image: bakeryMiniMousseMaracuya,
    alt: "Mini Mousse de Maracuyá individual de SOAD Bakery",
  },

  // ================= Slices =================
  {
    id: "slice-blackberry-lemon",
    name: "BlackBerry Lemon Slice",
    category: "slices",
    price: 195,
    description: "Pedazo grande de pastel de mora relleno de limón.",
    image: sliceBlackberryLemon,
    alt: "Rebanada de BlackBerry Lemon Cake de SOAD Bakery",
  },
  {
    id: "slice-zanahoria",
    name: "Zanahoria Cake Slice",
    category: "slices",
    price: 195,
    description: "Slice de pastel de zanahoria relleno con cheesecake.",
    image: sliceZanahoria,
    alt: "Rebanada de pastel de Zanahoria de SOAD Bakery relleno de cheesecake",
  },
  {
    id: "slice-selva-negra",
    name: "Selva Negra Slice",
    category: "slices",
    price: 195,
    description: "Torta de chocolate con relleno de pudín de chocolate, cerezas y mousse de chocolate blanco.",
    image: sliceSelvaNegra,
    alt: "Rebanada de Selva Negra de SOAD Bakery con cerezas",
  },
];

export const getProductsByCategory = (category: CategoryId): Product[] =>
  category === "todos" ? products : products.filter((p) => p.category === category);

export const featuredProducts = products.filter((p) => p.featured);

export { formatLempiras } from "../lib/currency";
