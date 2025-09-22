import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 p-4 shadow-[0_0_24px_rgba(217,70,239,0.15)] hover:shadow-[0_0_28px_rgba(217,70,239,0.3)] transition">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-40 object-cover rounded-xl mb-3 border border-slate-700/60"
      />
      <h3 className="text-lg font-semibold text-slate-100">{product.name}</h3>
      <p className="text-slate-400 text-sm mb-2 line-clamp-2">{product.description}</p>
      <p className="font-semibold text-emerald-300 mb-3">${product.price.toFixed(2)}</p>
      <div className="flex gap-2">
        <Link
          to={`/product/${product._id}`}
          className="flex-1 text-center px-3 py-2 rounded-lg border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 transition"
        >
          View
        </Link>
        <button
          onClick={() => onAdd(product)}
          className="flex-1 px-3 py-2 rounded-lg bg-fuchsia-500/90 text-slate-900 font-semibold hover:bg-fuchsia-400 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}