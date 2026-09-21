"use client";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/db";

export default function Contact() {
  const [s, setS] = useState({});
  useEffect(() => { getSettings().then(setS).catch(() => {}); }, []);

  const rows = [
    ["Email", s.email, s.email && `mailto:${s.email}`],
    ["Phone", s.phone, s.phone && `tel:${s.phone}`],
    ["Address", s.address],
    ["Hours", s.hours],
  ].filter(([, v]) => v);

  return (
    <section className="container-x max-w-3xl py-16">
      <h1 className="text-4xl sm:text-5xl">Contact</h1>
      <p className="mt-4 text-muted">Questions about a product or an order? Reach us any time.</p>
      <dl className="mt-12 divide-y divide-line border-y border-line">
        {rows.length === 0 && <p className="py-8 text-muted">Contact details will appear here soon.</p>}
        {rows.map(([k, v, href]) => (
          <div key={k} className="grid gap-1 py-6 sm:grid-cols-3">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="whitespace-pre-line sm:col-span-2">
              {href ? <a href={href} className="underline-offset-4 hover:underline">{v}</a> : v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
