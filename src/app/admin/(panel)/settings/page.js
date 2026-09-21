"use client";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { getSettings } from "@/lib/db";

const FIELDS = [
  ["email", "Contact email", "email"],
  ["phone", "Contact phone", "tel"],
  ["address", "Address", "textarea"],
  ["hours", "Opening hours", "text"],
];

export default function Settings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => { getSettings().then((d) => setS({ email: "", phone: "", address: "", hours: "", ...d })); }, []);

  async function save(e) {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "store"), s);
      setMsg("Settings saved.");
    } catch {
      setMsg("Settings could not be saved.");
    }
  }

  async function resetPassword() {
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setMsg(`Password reset link sent to ${auth.currentUser.email}.`);
    } catch {
      setMsg("The reset email could not be sent.");
    }
  }

  if (!s) return <p className="text-muted">Loading…</p>;

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-3xl">Settings</h1>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-white p-6">
        <p className="text-sm text-muted">These details appear on your Contact page.</p>
        {FIELDS.map(([k, label, type]) => (
          <div key={k}>
            <label className="label" htmlFor={k}>{label}</label>
            {type === "textarea"
              ? <textarea id={k} rows={3} className="input resize-none" value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
              : <input id={k} type={type} className="input" value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
          </div>
        ))}
        <button className="btn">Save settings</button>
      </form>
      <div className="rounded-2xl border border-line bg-white p-6">
        <h2 className="text-xl">Password</h2>
        <p className="mt-1 text-sm text-muted">We will email a reset link to your admin address.</p>
        <button onClick={resetPassword} className="btn-ghost mt-4">Send reset link</button>
      </div>
      {msg && <p className="text-sm text-muted" role="status">{msg}</p>}
    </div>
  );
}
