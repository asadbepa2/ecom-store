"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isAdminUser } from "@/lib/firebase";
import { STORE_NAME } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

// Guards every /admin/* page (except /admin/login, which sits outside the (panel) group).
export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (isAdminUser(user)) setReady(true);
      else router.replace("/admin/login");
    });
  }, [router]);

  if (!ready) return <div className="grid min-h-screen place-items-center text-sm text-muted">Checking access…</div>;

  return (
    <div className="min-h-screen bg-snow md:flex">
      <aside className="border-b border-line bg-white md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-5 md:block">
          <p className="font-heading text-xl">{STORE_NAME}</p>
          <p className="text-xs text-muted md:mt-1">Admin</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition ${
                pathname === l.href ? "bg-ink text-white" : "text-muted hover:bg-snow hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/" className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm text-muted hover:text-ink">View store</Link>
          <button
            onClick={() => signOut(auth).then(() => router.replace("/admin/login"))}
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm text-muted hover:text-ink"
          >
            Sign out
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
