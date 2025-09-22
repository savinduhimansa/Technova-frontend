export default function Badge({ children, tone = "info" }) {
  const map = {
    info: "bg-sky-900/60 text-sky-200 border-sky-700/60",
    ok: "bg-emerald-900/60 text-emerald-200 border-emerald-700/60",
    warn: "bg-amber-900/60 text-amber-200 border-amber-700/60",
    danger: "bg-rose-900/60 text-rose-200 border-rose-700/60",
  };
  return (
    <span className={`inline-flex items-center rounded-full border text-xs px-2 py-1 ${map[tone] || map.info}`}>
      {children}
    </span>
  );
}
