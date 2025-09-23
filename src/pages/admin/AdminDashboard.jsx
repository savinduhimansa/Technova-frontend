import { useEffect, useMemo, useState } from "react";
import { adminListBuilds, adminUpdateBuild, adminDeleteBuild } from "../../api/parts.js";

const STATUS = ["draft", "submitted", "approved", "rejected", "purchased"];

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // filter
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await adminListBuilds(status || undefined);
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load builds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [status]);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const k = q.toLowerCase();
    return rows.filter(r =>
      [r.buildId, r.name, r.status, r?.items?.cpu?.model, r?.items?.gpu?.model]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(k)
    );
  }, [rows, q]);

  const setStatusOf = async (buildId, newStatus) => {
    setBusyId(buildId);
    try {
      await adminUpdateBuild(buildId, { status: newStatus });
      await fetchAll();
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (buildId) => {
    if (!confirm("Delete this build?")) return;
    setBusyId(buildId);
    try {
      await adminDeleteBuild(buildId);
      await fetchAll();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search builds…"
            className="rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-sm flex-1 min-w-56" />
          <button onClick={fetchAll} className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm">Refresh</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/60 border-b border-slate-800/70">
            <tr className="[&>th]:px-3 [&>th]:py-3 text-left text-slate-300">
              <th>Build ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Total (LKR)</th>
              <th>CPU / GPU</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="px-3 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : filtered.length ? filtered.map((b) => (
              <tr key={b.buildId} className="border-b border-slate-800/70 hover:bg-slate-900/40">
                <td className="px-3 py-3 font-mono text-xs">{b.buildId}</td>
                <td className="px-3 py-3">{b.name || "-"}</td>
                <td className="px-3 py-3 capitalize">{b.status}</td>
                <td className="px-3 py-3">{Number(b?.prices?.total || 0).toLocaleString()}</td>
                <td className="px-3 py-3">
                  <div className="text-slate-200">{b?.items?.cpu?.model || "-"}</div>
                  <div className="text-slate-400 text-xs">{b?.items?.gpu?.model || "-"}</div>
                </td>
                <td className="px-3 py-3 text-xs">{new Date(b.createdAt).toLocaleString()}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    {/* Approvals */}
                    <button disabled={busyId === b.buildId} onClick={() => setStatusOf(b.buildId, "approved")}
                      className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50">Approve</button>
                    <button disabled={busyId === b.buildId} onClick={() => setStatusOf(b.buildId, "rejected")}
                      className="px-3 py-1 rounded bg-amber-700 hover:bg-amber-600 disabled:opacity-50">Reject</button>
                    <button disabled={busyId === b.buildId} onClick={() => setStatusOf(b.buildId, "purchased")}
                      className="px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50">Mark Purchased</button>
                    <button disabled={busyId === b.buildId} onClick={() => remove(b.buildId)}
                      className="px-3 py-1 rounded bg-rose-700 hover:bg-rose-600 disabled:opacity-50">Delete</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" className="px-3 py-6 text-center text-slate-400">No builds</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        Note: “Mark Purchased” uses the existing admin update endpoint to set <code>status: "purchased"</code>.
        If you need a **user**-side “Proceed to Purchase” flow, expose a public endpoint or integrate your Orders module.
      </p>
    </div>
  );
}
