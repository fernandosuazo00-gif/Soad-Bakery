// Verified via Google Maps ("Soad Bakery", Panadería, Tegucigalpa — phone
// 9621-2331, matching the business's own WhatsApp number). 4.4★ overall
// from 26 reviews at the time of writing. Only real, attributed reviews
// are used below — names, ratings and text are reproduced faithfully
// (excerpted where Google truncates the review). Do not add, invent or
// reword entries here.
export const googleListing = {
  name: "Soad Bakery",
  rating: 4.4,
  reviewCount: 26,
  mapsUrl:
    "https://www.google.com/maps/place/Soad+Bakery/@15.22431,-86.2092911,17z/data=!4m6!3m5!1s0x8f6fa34a0e9f073f:0x739057023bd3ab7c!8m2!3d15.22431!4d-86.2092912!16s%2Fg%2F11n7754fbc",
};

export interface Testimonial {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  relativeDate: string;
  quote: string;
  excerpt: boolean;
}

export const testimonials: Testimonial[] = [
  {
    author: "Franklin Silva",
    rating: 5,
    relativeDate: "hace 4 meses",
    quote:
      "Necesitaba un pastel de última hora para un cumpleaños, entré a una app de envíos y revisando las distintas pastelerías que habían los encontré, comencé a ver las fotos de sus pasteles... Solo tengo que decir que de ahora en adelante están…",
    excerpt: true,
  },
  {
    author: "MiZzu Zuniga",
    rating: 5,
    relativeDate: "hace 4 años",
    quote:
      "Definitivamente los mejores pasteles que he probado, son sumamente ricos, son pequeños pero cada pedazo lleno de sabor.",
    excerpt: false,
  },
  {
    author: "Rita Strada",
    rating: 3,
    relativeDate: "hace 1 año",
    quote:
      "Desde hace tiempo tenía muchas expectativas, vine a Tegus pedí el de mora limón y pues no encontré ese Wow, el lustre también estaba demasiado pero demasiado dulce ☹️",
    excerpt: true,
  },
];
