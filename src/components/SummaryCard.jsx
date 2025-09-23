export default function SummaryCard({ selected, fans, totals }) {
  const rows = [
    ["CPU", selected.cpu],
    ["Motherboard", selected.mb],
    ["RAM", selected.ram],
    ["GPU", selected.gpu],
    ["Case", selected.case],
    ["SSD", selected.ssd],
    ["HDD", selected.hdd],
    ["PSU", selected.psu],
  ];
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
      <h2 className="text-lg font-semibold tracking-wide mb-3">Summary</h2>
      <div className="grid gap-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-slate-800/60 py-2">
            <span className="text-slate-300">{k}</span>
            <span className="text-right text-slate-200">{v ? `${v.brand || ""} ${v.model || v.productId}` : "-"}</span>
          </div>
        ))}
        {!!fans.length && (
          <div className="pt-2">
            <div className="text-slate-300 mb-1">Fans</div>
            <ul className="list-disc list-inside text-slate-200">
              {fans.map(f => <li key={f.productId}>{f.brand} {f.model}</li>)}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-slate-900/60 border border-slate-800/70 p-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Subtotal</span>
          <span className="font-semibold">LKR {totals.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-slate-300">Total</span>
          <span className="text-sky-300 font-semibold">LKR {totals.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
