"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useAuthUser from "@/lib/useAuthUser";

export default function Account() {
  const user = useAuthUser();
  const router = useRouter();

  useEffect(() => { if (user === null) router.replace("/login"); }, [user, router]);

  if (!user) return <div className="container-x py-24 text-muted">Loading…</div>;

  const first = (user.displayName || user.email.split("@")[0]).split(" ")[0];

  return (
    <section className="container-x max-w-2xl py-20">
      <h1 className="text-4xl sm:text-5xl">Welcome, {first}.</h1>
      <p className="mt-4 text-muted">You are signed in as {user.email}. More features are coming soon.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/product" className="btn">Browse products</Link>
        <button onClick={() => signOut(auth).then(() => router.replace("/"))} className="btn-ghost">Log out</button>
      </div>
    </section>
  );
}
