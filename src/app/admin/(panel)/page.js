"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDate, formatPrice } from "@/lib/utils";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([getDocs(collection(db, "products")), getDocs(collection(db, "orders"))]).then(([p, o]) => {
      const orders = o.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setData({ products: p.size, orders });
    });
  }, []);

  if (!data) return <p className="text-muted">Loading…</p>;
  const { products, orders } = data;
  const pending = orders.filter((o) => o.status === "pending").length;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.price * o.quantity, 0);
  const stats = [
    ["Products", products],
    ["Orders", orders.length],
    ["Pending", pending],
    ["Order value", formatPrice(revenue)],
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-3xl">Overview</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm text-muted">{k}</p>
            <p className="mt-2 font-heading text-3xl">{v}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted hover:text-ink">View all</Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-line">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td className="p-4">{o.name}</td>
                  <td className="p-4 text-muted">{o.productTitle} × {o.quantity}</td>
                  <td className="p-4 capitalize">{o.status}</td>
                  <td className="p-4 text-muted">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
              {!orders.length && <tr><td className="p-6 text-muted">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
