export interface CartItem {
  id: string;
  name: string;
  price: number | null;
  image: string;
  qty: number;
}

export type OrderMethod = "delivery" | "pickup";

const CART_KEY = "soad-cart-v1";
const METHOD_KEY = "soad-order-method-v1";

const readCart = (): CartItem[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode etc.) — cart just won't persist */
  }
  emitChange(items);
};

const emitChange = (items: CartItem[]) => {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.qty,
    0
  );
  const hasUnpricedItems = items.some((item) => item.price === null);
  window.dispatchEvent(
    new CustomEvent("soad-cart:change", {
      detail: { items, count, subtotal, hasUnpricedItems },
    })
  );
};

export const SoadCart = {
  getItems: readCart,

  add(item: Omit<CartItem, "qty">, qty = 1) {
    const items = readCart();
    const existing = items.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ ...item, qty });
    }
    writeCart(items);
  },

  setQty(id: string, qty: number) {
    let items = readCart();
    if (qty <= 0) {
      items = items.filter((i) => i.id !== id);
    } else {
      const existing = items.find((i) => i.id === id);
      if (existing) existing.qty = qty;
    }
    writeCart(items);
  },

  remove(id: string) {
    const items = readCart().filter((i) => i.id !== id);
    writeCart(items);
  },

  clear() {
    writeCart([]);
  },

  getMethod(): OrderMethod {
    if (typeof localStorage === "undefined") return "delivery";
    const stored = localStorage.getItem(METHOD_KEY);
    return stored === "pickup" ? "pickup" : "delivery";
  },

  setMethod(method: OrderMethod) {
    try {
      localStorage.setItem(METHOD_KEY, method);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent("soad-cart:method-change", { detail: { method } })
    );
  },

  init() {
    // Broadcast current state once on load so listeners mounted after
    // this module (e.g. the header badge) sync immediately.
    emitChange(readCart());

    // Event delegation covers both the per-card quantity stepper and the
    // "Agregar" button so a single listener works for any number of
    // ProductCard instances, including ones rendered after filtering.
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      const stepper = target.closest<HTMLElement>(".qty-increment, .qty-decrement");
      if (stepper) {
        const card = stepper.closest<HTMLElement>("[data-product-card]");
        const valueEl = card?.querySelector<HTMLElement>(".qty-value");
        if (valueEl) {
          const current = parseInt(valueEl.textContent || "1", 10) || 1;
          const next = stepper.classList.contains("qty-increment")
            ? Math.min(current + 1, 99)
            : Math.max(current - 1, 1);
          valueEl.textContent = String(next);
        }
        return;
      }

      const trigger = target.closest<HTMLElement>("[data-add-to-cart]");
      if (!trigger) return;
      const payload = trigger.getAttribute("data-add-to-cart");
      if (!payload) return;
      try {
        const product = JSON.parse(payload) as Omit<CartItem, "qty">;
        const card = trigger.closest<HTMLElement>("[data-product-card]");
        const valueEl = card?.querySelector<HTMLElement>(".qty-value");
        const qty = valueEl ? parseInt(valueEl.textContent || "1", 10) || 1 : 1;
        SoadCart.add(product, qty);
        if (valueEl) valueEl.textContent = "1";
        window.dispatchEvent(
          new CustomEvent("soad-cart:added", { detail: { product, qty } })
        );
      } catch {
        /* malformed payload — ignore */
      }
    });
  },
};

declare global {
  interface Window {
    SoadCart: typeof SoadCart;
  }
}

if (typeof window !== "undefined") {
  window.SoadCart = SoadCart;
  SoadCart.init();
}
