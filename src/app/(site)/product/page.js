import ProductGrid from "@/components/ProductGrid";

export const metadata = { title: "Products" };

export default function Catalog() {
  return (
    <section className="container-x py-16">
      <h1 className="mb-12 text-4xl sm:text-5xl">All products</h1>
      <ProductGrid />
    </section>
  );
}
