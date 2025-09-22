import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBuild } from "../api/parts";
import Badge from "../components/Badge.jsx";

export default function BuildPreview() {
  const { buildId } = useParams();
  const [build, setBuild] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getBuild(buildId)
      .then(setBuild)
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load build"));
  }, [buildId]);

  if (err) {
    return (
      <div className="rounded-2xl border border-rose-700/50 bg-rose-950/40 p-6">
        <div className="text-rose-200 font-semibold mb-2">Error</div>
        <div className="text-rose-200/90">{err}</div>
        <Link className="inline-block mt-4 text-sky-300 hover:underline" to="/builder">← Back to builder</Link>
      </div>
    );
  }

  if (!build) return <div className="text-slate-300">Loading…</div>;

  const I = build.items || {};
  const P = build.prices || { subtotal: 0, tax: 0, total: 0 };

  const rows = [
    ["CPU", I.cpu],
    ["Motherboard", I.motherboard],
    ["RAM", I.ram],
    ["GPU", I.gpu],
    ["Case", I.case],
    ["SSD", I.ssd],
    ["HDD", I.hdd],
    ["PSU", I.psu],
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{build.name || build.buildId}</h1>
        <Badge tone={build.compatibility?.ok ? "ok" : "warn"}>
          {build.status?.toUpperCase()} · {build.compatibility?.ok ? "Compatible" : "Check issues"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40">
          <div className="px-5 py-4 border-b border-slate-800/70 text-slate-200 font-medium">
            Selected Parts
          </div>
          <div className="p-5 grid gap-3">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <div className="w-28 text-slate-300">{k}</div>
                <div className="flex-1">
                  {v ? (
                    <div className="text-slate-100">{v.brand} {v.model}</div>
                  ) : <div className="text-slate-500">-</div>}
                </div>
                <div className="text-slate-300">{v?.price != null ? `LKR ${v.price.toLocaleString()}` : ""}</div>
              </div>
            ))}
            {!!I.fans?.length && (
              <div className="pt-2">
                <div className="text-slate-300 mb-1">Fans</div>
                <ul className="list-disc list-inside text-slate-200">
                  {I.fans.map(f => <li key={f.productId}>{f.brand} {f.model} — LKR {f.price?.toLocaleString?.()}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
          <div className="text-slate-200 font-medium mb-3">Totals</div>
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-slate-300">Subtotal</span><span>LKR {Number(P.subtotal || 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-300">Tax</span><span>LKR {Number(P.tax || 0).toLocaleString()}</span></div>
            <div className="flex justify-between text-sky-300 font-semibold"><span>Total</span><span>LKR {Number(P.total || 0).toLocaleString()}</span></div>
          </div>
          <div className="mt-6">
            <Link to="/builder" className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600">← Back to builder</Link>
          </div>
        </div>
      </div>

      {!build.compatibility?.ok && build.compatibility?.errors?.length ? (
        <div className="rounded-2xl border border-amber-700/50 bg-amber-950/40 p-5">
          <div className="text-amber-200 font-medium mb-2">Compatibility issues</div>
          <ul className="list-disc list-inside text-amber-100">
            {build.compatibility.errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
