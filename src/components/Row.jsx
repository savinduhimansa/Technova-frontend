export default function Row({ label, right, hint }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2">
      <div className="sm:w-48 shrink-0 text-sm text-slate-300">{label}</div>
      <div className="flex-1">{right}</div>
      {hint ? <div className="text-xs text-slate-400">{hint}</div> : null}
    </div>
  );
}
