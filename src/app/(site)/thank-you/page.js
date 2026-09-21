import Link from "next/link";

export const metadata = { title: "Thank you" };

export default function ThankYou() {
  return (
    <section className="container-x max-w-xl py-28 text-center">
      <h1 className="text-4xl sm:text-5xl">Thank you.</h1>
      <p className="mt-5 text-muted">Your order has been received. We will call you shortly to confirm the details.</p>
      <Link href="/product" className="btn mt-10">Continue shopping</Link>
    </section>
  );
}
