import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  limit, 
  orderBy, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// Helper to clear localStorage product caches
export function clearProductCache() {
  if (typeof window !== "undefined") {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("store_products") || key.startsWith("store_product_")) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Fetch all products (with caching)
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

  if (typeof window !== "undefined") {
    localStorage.setItem(cacheKey, JSON.stringify(products));
  }

  return products;
}

// Fetch single product (with caching)
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

// Fetch store settings (with caching)
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

// --- AUTOMATIC MUTATIONS & CACHE INVALIDATION ---

export async function createProduct(productData) {
  const docRef = await addDoc(collection(db, "products"), {
    ...productData,
    createdAt: serverTimestamp(),
  });
  clearProductCache(); // Automatically clears cache on create
  return docRef.id;
}

export async function editProduct(id, productData) {
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, productData);
  clearProductCache(); // Automatically clears cache on update
}

export async function removeProduct(id) {
  const productRef = doc(db, "products", id);
  await deleteDoc(productRef);
  clearProductCache(); // Automatically clears cache on delete
}
