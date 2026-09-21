import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <section className="border-b border-line bg-snow">
        <div className="container-x py-24 text-center sm:py-36">
          <h1 className="mx-auto max-w-3xl text-5xl leading-[1.05] sm:text-7xl">Considered design, delivered to your door.</h1>
          <p className="mx-auto mt-6 max-w-xl text-muted">Browse the collection, choose what you love, and order in under a minute. No account needed.</p>
          <Link href="/product" className="btn mt-10">Shop products</Link>
        </div>
      </section>
      <section className="container-x pt-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl sm:text-4xl">Featured</h2>
          <Link href="/product" className="text-sm text-muted transition hover:text-ink">View all</Link>
        </div>
        <ProductGrid max={4} />
      </section>
    </>
  );
}
