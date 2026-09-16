import { formatLempiras } from "./currency";
import type { CartItem, OrderMethod } from "../scripts/cart";

const methodLabel: Record<OrderMethod, string> = {
  delivery: "Delivery",
  pickup: "Pickup",
};

export const buildWhatsAppOrderMessage = (
  items: CartItem[],
  method: OrderMethod
): string => {
  const lines = [
    "Hola SOAD Bakery 👋",
    "Quisiera realizar el siguiente pedido:",
    "",
    ...items.map((item) => {
      const priceNote =
        item.price !== null ? ` (${formatLempiras(item.price)} c/u)` : "";
      return `• ${item.qty}x ${item.name}${priceNote}`;
    }),
    "",
  ];

  const hasUnpriced = items.some((item) => item.price === null);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.qty,
    0
  );

  if (items.length === 0) {
    lines.push("(agrega productos desde soadbakery antes de enviar)");
  } else if (hasUnpriced) {
    lines.push("Total: a confirmar (hay precios pendientes de confirmar)");
  } else {
    lines.push(`Total: ${formatLempiras(subtotal)}`);
  }

  lines.push(`Método: ${methodLabel[method]}`);

  return lines.join("\n");
};

export const buildWhatsAppUrl = (
  whatsappBaseUrl: string,
  items: CartItem[],
  method: OrderMethod
): string => {
  const message = buildWhatsAppOrderMessage(items, method);
  return `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
};
