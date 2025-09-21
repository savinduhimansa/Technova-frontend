import { useEffect, useMemo, useState } from "react";
import { getCourierReport, getCouriers, deleteCourier } from "../api/couriers";

export default function CourierForm() {
  const [month, setMonth] = useState("");
  const [report, setReport] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const [couriers, setCouriers] = useState([]);
  const [loadingCouriers, setLoadingCouriers] = useState(false);

  const fetchReport = async () => {
    setLoadingReport(true);
    try {
      const res = await getCourierReport(month);
      setReport(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch courier report");
    } finally {
      setLoadingReport(false);
    }
  };

  const fetchCouriers = async () => {
    setLoadingCouriers(true);
    try {
      const res = await getCouriers();
      setCouriers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch couriers");
    } finally {
      setLoadingCouriers(false);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchCouriers();
  }, []);

  const handleExportCSV = () => {
    if (!report.length) return;
    const headers = [
      "Courier","Assigned Orders","Completed Orders","Delayed Orders",
      "On-time Rate (%)","Avg Delay (min)","Avg Lead (hrs)","Overall Performance"
    ];
    const rows = report.map(r => [
      r.courier, r.assignedOrders ?? 0, r.completedOrders ?? 0, r.delayedOrders ?? 0,
      r.onTimeRatePct ?? 0, r.avgDelayMinutes ?? "", r.avgLeadHours ?? "", r.overallPerformance ?? ""
    ]);
    const csv = [headers, ...rows].map(a => a.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `courier_report_${month || "all"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteCourier = async (id, name) => {
    if (!window.confirm(`Delete courier "${name}"?`)) return;
    try {
      await deleteCourier(id);
      await fetchCouriers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete courier");
    }
  };

  const hasReport = useMemo(() => report && report.length > 0, [report]);

  return (
    <div className="grid gap-6">
      {/* REPORT */}
      <section className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(217,70,239,0.15)] backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]">
            📊 Courier Performance Report
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-slate-300 text-sm flex items-center gap-2">
              <span>Month</span>
              <input
                type="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-1.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              />
            </label>
            <button
              onClick={fetchReport}
              disabled={loadingReport}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/90 text-slate-900 font-semibold hover:bg-cyan-400 transition
                         shadow-[0_0_18px_rgba(34,211,238,0.45)] disabled:opacity-60"
            >
              {loadingReport ? "Loading..." : "Filter"}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={!hasReport}
              className="px-3 py-1.5 rounded-lg border border-fuchsia-400/60 text-fuchsia-300 hover:bg-fuchsia-500/10 transition disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-cyan-400/20">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/70 text-cyan-300">
              <tr>
                {["Courier","Assigned","Completed","Delayed","On-time Rate (%)","Avg Delay (min)","Avg Lead (hrs)","Overall Perf."].map(h => (
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {!hasReport ? (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-slate-400">No data</td>
                </tr>
              ) : report.map((r, i) => (
                <tr key={r.courier} className={i % 2 ? "bg-slate-900/40" : "bg-slate-900/20"}>
                  <td className="px-4 py-2">{r.courier}</td>
                  <td className="px-4 py-2">{r.assignedOrders ?? 0}</td>
                  <td className="px-4 py-2">{r.completedOrders ?? 0}</td>
                  <td className="px-4 py-2">{r.delayedOrders ?? 0}</td>
                  <td className="px-4 py-2">{r.onTimeRatePct ?? 0}</td>
                  <td className="px-4 py-2">{r.avgDelayMinutes ?? "-"}</td>
                  <td className="px-4 py-2">{r.avgLeadHours ?? "-"}</td>
                  <td className="px-4 py-2">{r.overallPerformance ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MANAGE COURIERS *
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(34,211,238,0.18)] backdrop-blur">
        <h3 className="text-lg md:text-xl font-semibold text-cyan-300 mb-3">🧭 Manage Couriers</h3>
        <div className="overflow-x-auto rounded-xl border border-fuchsia-400/20">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/70 text-fuchsia-300">
              <tr>
                {["Name","Assigned","Completed","Delayed","Overall Perf.","Month","Actions"].map(h => (
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {!couriers.length ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-slate-400">
                    {loadingCouriers ? "Loading..." : "No couriers"}
                  </td>
                </tr>
              ) : couriers.map((c, i) => (
                <tr key={c._id} className={i % 2 ? "bg-slate-900/40" : "bg-slate-900/20"}>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.assignedOrders}</td>
                  <td className="px-4 py-2">{c.completedOrders}</td>
                  <td className="px-4 py-2">{c.delayedOrders}</td>
                  <td className="px-4 py-2">{c.overallPerformance || "-"}</td>
                  <td className="px-4 py-2">{c.month || "-"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteCourier(c._id, c.name)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-300 hover:bg-rose-500/30 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>*/}
    </div>
  );
}
