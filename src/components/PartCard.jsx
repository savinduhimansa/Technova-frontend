export default function PartCard({ part, selected, onPick }) {
  const img = Array.isArray(part.images) && part.images[0] ? part.images[0] : "";
  return (
    <button
      onClick={() => onPick?.(part)}
      className={`group flex items-center gap-4 w-full text-left rounded-xl border border-slate-800/70 p-3 hover:border-sky-600/60 hover:bg-slate-900/60 transition
        ${selected ? "ring-2 ring-sky-500/60" : ""}`}
    >
      <img
        src={img}
        alt={part.model || part.brand}
        className="size-14 rounded-lg object-cover bg-slate-800/60"
        loading="lazy"
      />
      <div className="flex-1">
        <div className="font-medium text-slate-100">
          {part.brand ? `${part.brand} ` : ""}{part.model || part.productId}
        </div>
        <div className="text-xs text-slate-400">
          {part.socket ? `Socket: ${part.socket} · ` : ""}
          {"price" in part ? `LKR ${Number(part.price || 0).toLocaleString()}` : ""}
        </div>
      </div>
      <div className="text-xs text-slate-400">Stock: {part.stock ?? "-"}</div>
    </button>
  );
}
