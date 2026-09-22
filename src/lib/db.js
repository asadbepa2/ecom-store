import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export async function getProducts(max) {
  const cacheKey = max ? `store_products_max_${max}` : "store_products_all";

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const base = [collection(db, "products"), orderBy("createdAt", "desc")];
  const q = max ? query(...base, limit(max)) : query(...base);
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // 3. Save to browser cache for future page reloads/visits
  if (typeof window !== "undefined") {
    localStorage.setItem(cacheKey, JSON.stringify(products));
  }

  return products;
}

export async function getProduct(id) {
  const cacheKey = `store_product_${id}`;

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const snap = await getDoc(doc(db, "products", id));
  const product = snap.exists() ? { id: snap.id, ...snap.data() } : null;

  
  if (typeof window !== "undefined" && product) {
    localStorage.setItem(cacheKey, JSON.stringify(product));
  }

  return product;
}

export async function getSettings() {
  const cacheKey = "store_settings";

  
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const snap = await getDoc(doc(db, "settings", "store"));
  const settings = snap.exists() ? snap.data() : {};

 
  if (typeof window !== "undefined") {
    localStorage.setItem(cacheKey, JSON.stringify(settings));
  }

  return settings;
}
