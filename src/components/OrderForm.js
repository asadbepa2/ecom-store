"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatPrice } from "@/lib/utils";
import useAuthUser from "@/lib/useAuthUser";

export default function OrderForm({ product }) {
  const router = useRouter();
  const user = useAuthUser();
  const [form, setForm] = useState({ name: "", phone: "", address: "", quantity: 1 });
  const [status, setStatus] = useState("idle"); // idle | sending | error
  useEffect(() => {
    if (user?.displayName) setForm((f) => (f.name ? f : { ...f, name: user.displayName }));
  }, [user]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const qty = Math.min(100, Math.max(1, parseInt(form.quantity, 10) || 1));

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "orders"), {
        productId: product.id,
        productTitle: product.title,
        price: Number(product.price),
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        quantity: qty,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      router.push("/thank-you");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-soft">
      <h3 className="text-xl">Place your order</h3>
      <div>
        <label className="label" htmlFor="name">Full name</label>
        <input id="name" required minLength={2} maxLength={99} className="input" value={form.name} onChange={set("name")} autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="phone">Phone number</label>
        <input id="phone" required type="tel" minLength={5} maxLength={29} className="input" value={form.phone} onChange={set("phone")} autoComplete="tel" />
      </div>
      <div>
        <label className="label" htmlFor="address">Delivery address</label>
        <textarea id="address" required minLength={5} maxLength={499} rows={3} className="input resize-none" value={form.address} onChange={set("address")} autoComplete="street-address" />
      </div>
      <div>
        <label className="label" htmlFor="qty">Quantity</label>
        <input id="qty" required type="number" min={1} max={100} className="input" value={form.quantity} onChange={set("quantity")} />
      </div>
      <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="text-muted">Total</span>
        <span className="text-base font-semibold">{formatPrice(product.price * qty)}</span>
      </div>
      {status === "error" && <p className="text-sm text-red-600">Your order could not be sent. Check your connection and try again.</p>}
      <button className="btn w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Place order"}
      </button>
    </form>
  );
}
