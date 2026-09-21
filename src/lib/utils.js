export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Store";
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "$";

export const formatPrice = (n) =>
  `${CURRENCY}${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export const formatDate = (ts) => (ts?.toDate ? ts.toDate().toLocaleString() : "—");
