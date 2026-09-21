"use client";
import Link from "next/link";
import { STORE_NAME } from "@/lib/utils";
import useAuthUser from "@/lib/useAuthUser";

export default function Navbar() {
  const user = useAuthUser();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="font-heading text-xl">{STORE_NAME}</Link>
        <nav className="flex items-center gap-6 text-sm text-muted sm:gap-7">
          <Link href="/product" className="transition hover:text-ink">Products</Link>
          <Link href="/contact" className="transition hover:text-ink">Contact</Link>
          {user ? (
            <Link href="/account" className="btn-ghost !py-2">Account</Link>
          ) : user === null ? (
            <Link href="/login" className="btn-ghost !py-2">Log in</Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
