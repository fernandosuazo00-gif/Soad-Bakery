// Central, editable source of truth for business facts.
// Update phone numbers, links and hours here — nothing else in the
// codebase should hardcode them.

export const site = {
  name: "SOAD Bakery",
  tagline: "Repostería artesanal & Gift Center",
  description:
    "Repostería artesanal y gift center en Tegucigalpa. Dark bakery con envío propio y por apps de delivery. Pedí por WhatsApp o PedidosYa.",
  city: "Tegucigalpa, Honduras",
  locale: "es-HN",
};

export const contact = {
  whatsappNumber: "50496212331", // international format, no symbols
  whatsappDisplay: "+504 9621-2331",
  whatsappBaseUrl: "https://wa.me/50496212331",
  pedidosYaUrl:
    "https://www.pedidosya.com.hn/restaurantes/tegucigalpa/soad-bakery-3a07e9c7-0c8f-4ecc-a5b7-ee2497f4de62-menu",
};

export const social = {
  instagram: "https://www.instagram.com/soadbakery/",
  tiktok: "https://www.tiktok.com/@soadbakery?_r=1&_t=ZT-99n3B5nwjte",
  facebook: "https://www.facebook.com/share/19YDjknvmu/?mibextid=wwXIfr",
};

export const hours = [
  { days: "Lunes – Sábado", time: "8:00 a.m. – 6:00 p.m." },
  { days: "Domingo", time: "9:00 a.m. – 4:00 p.m." },
];

export const isOpenNow = (date: Date = new Date()): boolean => {
  // America/Tegucigalpa is UTC-6 year round (no DST).
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const local = new Date(utc - 6 * 60 * 60 * 1000);
  const day = local.getDay(); // 0 Sun .. 6 Sat
  const minutes = local.getHours() * 60 + local.getMinutes();
  if (day === 0) return minutes >= 9 * 60 && minutes < 16 * 60;
  return minutes >= 8 * 60 && minutes < 18 * 60;
};

export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Nuestra Historia", href: "/nuestra-historia" },
  { label: "Vending", href: "/vending" },
  { label: "Contacto", href: "/contacto" },
];

export const orderMethods = {
  delivery: {
    id: "delivery" as const,
    label: "Delivery",
    description: "Lo llevamos hasta tu puerta con envío propio.",
  },
  pickup: {
    id: "pickup" as const,
    label: "Pickup",
    description: "Coordinamos el punto y la hora para que lo recojas.",
  },
};

export type OrderMethodId = keyof typeof orderMethods;
