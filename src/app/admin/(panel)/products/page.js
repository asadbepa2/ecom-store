"use client";
import { useCallback, useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { getProducts } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

const empty = { title: "", price: "", description: "", imageUrl: "" };

export default function ProductManager() {
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => getProducts().then(setProducts), []);
  useEffect(() => { load(); }, [load]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!file && !form.imageUrl) return setError("Add an image URL or upload an image.");
    setBusy(true);
    try {
      let imageUrl = form.imageUrl.trim();
      if (file) {
        const r = ref(storage, `products/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`);
        await uploadBytes(r, file);
        imageUrl = await getDownloadURL(r);
      }
      await addDoc(collection(db, "products"), {
        title: form.title.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
      });
      setForm(empty);
      setFile(null);
      e.target.reset();
      await load();
    } catch {
      setError("The product could not be saved. Check your Firebase rules and try again.");
    }
    setBusy(false);
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "products", p.id));
    load();
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl">Products</h1>
      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="t">Title</label>
          <input id="t" required className="input" value={form.title} onChange={set("title")} />
        </div>
        <div>
          <label className="label" htmlFor="p">Price</label>
          <input id="p" required type="number" min="0" step="0.01" className="input" value={form.price} onChange={set("price")} />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="d">Description</label>
          <textarea id="d" required rows={3} className="input resize-none" value={form.description} onChange={set("description")} />
        </div>
        <div>
          <label className="label" htmlFor="u">Image URL</label>
          <input id="u" type="url" className="input" placeholder="https://…" value={form.imageUrl} onChange={set("imageUrl")} disabled={!!file} />
        </div>
        <div>
          <label className="label" htmlFor="f">Or upload an image (max 5 MB)</label>
          <input id="f" type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files[0] || null)} />
        </div>
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
        <div className="md:col-span-2"><button className="btn" disabled={busy}>{busy ? "Saving…" : "Add product"}</button></div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr><th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Price</th><th className="p-4" /></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products?.map((p) => (
              <tr key={p.id}>
                <td className="flex items-center gap-4 p-4">
                  <img src={p.imageUrl} alt="" className="h-12 w-12 rounded-lg border border-line object-cover" />
                  {p.title}
                </td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4 text-right"><button onClick={() => remove(p)} className="text-red-600 hover:underline">Delete</button></td>
              </tr>
            ))}
            {products && !products.length && <tr><td colSpan={3} className="p-6 text-muted">No products yet. Add your first one above.</td></tr>}
            {!products && <tr><td colSpan={3} className="p-6 text-muted">Loading…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
