import { useEffect, useMemo, useState } from "react";
import PartCard from "./PartCard.jsx";

export default function PartPicker({
  title,
  items,
  value,
  onChange,
  placeholder = "Search…",
  filterText = true,
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!filterText || !q.trim()) return items || [];
    const k = q.toLowerCase();
    return (items || []).filter((it) =>
      [it.brand, it.model, it.productId].filter(Boolean).join(" ").toLowerCase().includes(k)
    );
  }, [items, q, filterText]);

  useEffect(() => {
    if (value && items?.length) {
      const exist = items.find((x) => x.productId === value.productId);
      if (!exist) onChange?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/70">
        <h3 className="text-sm font-semibold tracking-wide text-slate-200">{title}</h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="text-sm rounded-lg bg-slate-900/80 border border-slate-700/60 px-3 py-1.5 focus:outline-none focus:ring focus:ring-sky-700/40"
        />
      </div>
      <div className="max-h-72 overflow-y-auto p-3 grid gap-2">
        {filtered?.length ? (
          filtered.map((it) => (
            <PartCard
              key={it.productId}
              part={it}
              selected={value?.productId === it.productId}
              onPick={onChange}
            />
          ))
        ) : (
          <div className="text-sm text-slate-400 px-2 py-4">No items</div>
        )}
      </div>
    </div>
  );
}
