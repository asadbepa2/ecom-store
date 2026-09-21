"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import useAuthUser from "@/lib/useAuthUser";

const ERRORS = {
  "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
};

export default function AuthForm({ mode }) {
  const signup = mode === "signup";
  const router = useRouter();
  const user = useAuthUser();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => { if (user) router.replace("/account"); }, [user, router]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNote("");
    try {
      if (signup) {
        const { user: u } = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(u, { displayName: form.name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      router.replace("/account");
    } catch (err) {
      setError(ERRORS[err.code] || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function forgot() {
    if (!form.email) return setError("Enter your email above first.");
    try {
      await sendPasswordResetEmail(auth, form.email);
      setError("");
      setNote("Password reset link sent. Check your inbox.");
    } catch {
      setError("The reset email could not be sent.");
    }
  }

  return (
    <section className="container-x grid place-items-center py-20">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border border-line bg-white p-8 shadow-soft">
        <h1 className="text-3xl">{signup ? "Create your account" : "Welcome back"}</h1>
        <p className="text-sm text-muted">{signup ? "It takes less than a minute." : "Log in to your account."}</p>
        {signup && (
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" required minLength={2} className="input" value={form.name} onChange={set("name")} autoComplete="name" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={6} className="input" value={form.password} onChange={set("password")} autoComplete={signup ? "new-password" : "current-password"} />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {note && <p className="text-sm text-muted" role="status">{note}</p>}
        <button className="btn w-full" disabled={busy}>
          {busy ? "Please wait…" : signup ? "Sign up" : "Log in"}
        </button>
        {!signup && (
          <button type="button" onClick={forgot} className="block w-full text-center text-sm text-muted transition hover:text-ink">
            Forgot your password?
          </button>
        )}
        <p className="border-t border-line pt-4 text-center text-sm text-muted">
          {signup ? "Already have an account? " : "New here? "}
          <Link href={signup ? "/login" : "/signup"} className="text-ink underline-offset-4 hover:underline">
            {signup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </section>
  );
}
