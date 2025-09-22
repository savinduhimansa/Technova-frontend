import { useEffect, useState } from "react";
import { getDeliveries, updateDeliveryStatus, deleteDelivery } from "../api/deliveries";

export default function DeliveryList({ refresh }) { // ⬅️ take refresh
  const [deliveries, setDeliveries] = useState([]);

  const fetchAll = async () => {
    const res = await getDeliveries();
    setDeliveries(res.data);
  };

  useEffect(() => { fetchAll(); }, []);        // initial
  useEffect(() => { fetchAll(); }, [refresh]); // 🔁 when form assigns new one

  const update = async (id, status) => { await updateDeliveryStatus(id, status); fetchAll(); };
  const remove = async (id) => { if (confirm("Delete this delivery?")) { await deleteDelivery(id); fetchAll(); } };

  const badge = (s) =>
    s === "Pending" ? "bg-amber-500/20 text-amber-300 border-amber-400/40" :
    s === "Out for Delivery" ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40" :
    s === "Delivered" ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40" :
    "bg-rose-500/20 text-rose-300 border-rose-400/40";

  return (
    <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(217,70,239,0.15)] backdrop-blur mt-6">
      <h2 className="text-xl font-bold text-fuchsia-300 mb-4">📦 Deliveries</h2>

      <div className="overflow-x-auto rounded-xl border border-cyan-400/20">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/70 text-cyan-300">
            <tr>
              {["OrderID","Courier","Scheduled","Status","Update"].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {deliveries.map((d, i) => (
              <tr key={d._id} className={i % 2 ? "bg-slate-900/40" : "bg-slate-900/20"}>
                <td className="px-4 py-2">{d.orderId}</td>
                <td className="px-4 py-2">{d.courierService}</td>
                <td className="px-4 py-2">{d.scheduledDate ? new Date(d.scheduledDate).toLocaleString() : "N/A"}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded border ${badge(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={d.status}
                      onChange={(e) => update(d._id, e.target.value)}
                      className="rounded-lg bg-slate-800/80 border border-cyan-400/40 px-2 py-1 text-slate-100 focus:outline-none"
                    >
                      <option>Pending</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                      <option>Delayed</option>
                    </select>
                    <button
                      onClick={() => remove(d._id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-300 hover:bg-rose-500/30 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
