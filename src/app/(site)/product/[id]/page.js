"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import OrderForm from "@/components/OrderForm";
import { getProduct } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(undefined); // undefined = loading, null = missing

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => setProduct(null));
  }, [id]);

  if (product === undefined) return <div className="container-x py-24 text-muted">Loading…</div>;
  if (product === null)
    return (
      <div className="container-x py-24">
        <h1 className="text-3xl">Product not found</h1>
        <Link href="/product" className="btn-ghost mt-6">Back to products</Link>
      </div>
    );

  return (
    <section className="container-x grid gap-12 py-16 lg:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-snow">
        <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
      </div>
      <div>
        <Link href="/product" className="text-sm text-muted transition hover:text-ink">← All products</Link>
        <h1 className="mt-4 text-4xl sm:text-5xl">{product.title}</h1>
        <p className="mt-3 text-2xl">{formatPrice(product.price)}</p>
        <p className="mt-6 max-w-prose whitespace-pre-line leading-relaxed text-muted">{product.description}</p>
        <div className="mt-10"><OrderForm product={product} /></div>
      </div>
    </section>
  );
}
