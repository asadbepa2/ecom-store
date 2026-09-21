"use client";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDate, formatPrice } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(
    () => onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (s) =>
      setOrders(s.docs.map((d) => ({ id: d.id, ...d.data() })))),
    []
  );

  const setStatus = (o, status) => updateDoc(doc(db, "orders", o.id), { status });
  const remove = (o) => confirm(`Delete the order from ${o.name}?`) && deleteDoc(doc(db, "orders", o.id));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Orders</h1>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>{["Date", "Customer", "Phone", "Address", "Product", "Qty", "Total", "Status", ""].map((h) => <th key={h} className="p-4 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line align-top">
            {orders?.map((o) => (
              <tr key={o.id}>
                <td className="p-4 text-muted">{formatDate(o.createdAt)}</td>
                <td className="p-4">{o.name}</td>
                <td className="p-4"><a href={`tel:${o.phone}`} className="hover:underline">{o.phone}</a></td>
                <td className="max-w-[220px] whitespace-pre-line p-4 text-muted">{o.address}</td>
                <td className="p-4">{o.productTitle}</td>
                <td className="p-4">{o.quantity}</td>
                <td className="p-4">{formatPrice(o.price * o.quantity)}</td>
                <td className="p-4">
                  <select value={o.status} onChange={(e) => setStatus(o, e.target.value)} className="rounded-lg border border-line bg-white px-2 py-1.5 capitalize">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4"><button onClick={() => remove(o)} className="text-red-600 hover:underline">Delete</button></td>
              </tr>
            ))}
            {orders && !orders.length && <tr><td colSpan={9} className="p-6 text-muted">No orders yet. New orders appear here instantly.</td></tr>}
            {!orders && <tr><td colSpan={9} className="p-6 text-muted">Loading…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
