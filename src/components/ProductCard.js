import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-snow transition group-hover:shadow-soft">
        <img src={product.imageUrl} alt={product.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-lg leading-snug">{product.title}</h3>
        <p className="whitespace-nowrap pt-1 text-sm text-muted">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
