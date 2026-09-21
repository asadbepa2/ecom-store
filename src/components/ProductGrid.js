"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/db";

export default function ProductGrid({ max }) {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts(max).then(setProducts).catch(() => setError("Products could not be loaded. Please refresh."));
  }, [max]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!products)
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {Array.from({ length: max || 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-2xl bg-snow" />
        ))}
      </div>
    );
  if (!products.length) return <p className="text-muted">No products yet. Check back soon.</p>;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
