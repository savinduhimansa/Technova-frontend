import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../api/product";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      const res = await getProducts();
      setProduct(res.data.find((p) => p._id === id) || null);
    })();
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <p className="p-6 text-slate-300">Loading...</p>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 🔮 Neon background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-28 left-8 w-72 h-72 bg-fuchsia-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse [animation-delay:250ms]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* breadcrumb */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-cyan-300 hover:underline">Home</Link>
          <span className="mx-2 text-slate-500">/</span>
          <span className="text-slate-300">Product</span>
        </div>

        {/* glass card */}
        <div className="grid md:grid-cols-2 gap-8 rounded-2xl border border-fuchsia-500/30 bg-slate-900/60 backdrop-blur p-5 shadow-[0_0_30px_rgba(217,70,239,0.12)]">
          {/* image panel */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-fuchsia-500/0 via-fuchsia-500/10 to-cyan-400/10 blur-xl -z-10" />
            <img
              className="w-full aspect-[4/3] object-cover rounded-xl border border-cyan-400/30 shadow-[0_0_24px_rgba(34,211,238,0.18)]"
              src={product.images?.[0]}
              alt={product.name}
            />
            {/* stock pill */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-xs border border-emerald-400/40 bg-emerald-500/15 text-emerald-300">
                {typeof product.stock === "number" ? `In stock: ${product.stock}` : "In stock"}
              </span>
            </div>
          </div>

          {/* details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tight text-fuchsia-300 drop-shadow-[0_0_14px_rgba(236,72,153,0.7)]">
              {product.name}
            </h1>

            <p className="mt-3 text-slate-300 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-2xl font-bold text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.25)]">
                ${product.price.toFixed(2)}
              </span>
              {product.productId && (
                <span className="px-2.5 py-1 rounded-full text-xs border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
                  ID: {product.productId}
                </span>
              )}
            </div>

            {/* qty + actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Qty</label>
                <input
                  type="number"
                  min={1}
                  max={product.stock || 999}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                  className="w-24 rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-semibold hover:scale-[1.02] transition shadow-[0_0_18px_rgba(6,182,212,0.45)] focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              >
                Add to Cart
              </button>

              <Link
                to="/"
                className="px-4 py-2 rounded-xl border border-slate-600/60 text-slate-200 hover:bg-slate-800/60 transition"
              >
                ← Back to products
              </Link>
            </div>

            {/* meta grid */}
            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-cyan-400/20 bg-slate-900/40 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-400">Category</div>
                <div className="text-slate-100">{product.category || "—"}</div>
              </div>
              <div className="rounded-lg border border-cyan-400/20 bg-slate-900/40 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-400">Brand</div>
                <div className="text-slate-100">{product.brand || "—"}</div>
              </div>
              <div className="rounded-lg border border-cyan-400/20 bg-slate-900/40 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-400">Warranty</div>
                <div className="text-slate-100">{product.warranty || "Standard"}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
