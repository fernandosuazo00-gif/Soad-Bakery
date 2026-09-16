export const formatLempiras = (amount: number): string =>
  new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
