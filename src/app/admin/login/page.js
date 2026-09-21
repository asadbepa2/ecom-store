"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, isAdminUser } from "@/lib/firebase";
import { STORE_NAME } from "@/lib/utils";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => isAdminUser(u) && router.replace("/admin")), [router]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (!isAdminUser(user)) {
        await signOut(auth);
        setError("This account does not have admin access.");
      } else router.replace("/admin");
    } catch {
      setError("Incorrect email or password.");
    }
    setBusy(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-snow px-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border border-line bg-white p-8 shadow-soft">
        <h1 className="text-3xl">{STORE_NAME}</h1>
        <p className="text-sm text-muted">Sign in to manage your store.</p>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
