export default function Stepper({ steps, activeIndex }) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((s, i) => (
        <li
          key={s}
          className={`px-3 py-1 rounded-full text-xs border ${
            i === activeIndex
              ? "border-sky-600/60 bg-sky-900/40 text-sky-200"
              : i < activeIndex
              ? "border-emerald-700/50 bg-emerald-900/30 text-emerald-200"
              : "border-slate-700/50 bg-slate-900/40 text-slate-300"
          }`}
        >
          {i + 1}. {s}
        </li>
      ))}
    </ol>
  );
}
