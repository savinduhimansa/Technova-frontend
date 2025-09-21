import { useEffect, useState } from "react";
import { getOrders, deleteOrder } from "../api/orders";
import { generateInvoice } from "../api/invoices";

export default function OrderList({ onEdit, refresh }) { // ⬅️ take refresh
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);        // initial
  useEffect(() => { fetchOrders(); }, [refresh]); // 🔁 whenever parent bumps

  const filtered = orders.filter(o => {
    const s = search.toLowerCase();
    const m1 = o.orderID?.toLowerCase().includes(s);
    const m2 = o.customerName?.toLowerCase().includes(s);
    return (m1 || m2) && (statusFilter ? o.status === statusFilter : true);
  });

  const handleInvoice = async (orderMongoId) => {
    const res = await generateInvoice(orderMongoId);
    const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const a = document.createElement("a"); a.href = url; a.download = `invoice-${orderMongoId}.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(34,211,238,0.18)] backdrop-blur mt-6">
      <h2 className="text-xl font-bold text-cyan-300 mb-4">Order History</h2>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          placeholder="Search by OrderID or Customer Name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg bg-slate-800/80 border border-fuchsia-400/40 px-3 py-2 text-slate-100"
        >
          <option value="">All Statuses</option>
          <option>Pending</option><option>Confirmed</option><option>Processing</option>
          <option>Completed</option><option>Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-fuchsia-400/20">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/70 text-fuchsia-300">
            <tr>
              {["OrderID","Customer","Address","Items","Payment","Total","Status","Actions"].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {filtered.map((o, i) => (
              <tr key={o._id} className={i % 2 ? "bg-slate-900/40" : "bg-slate-900/20"}>
                <td className="px-4 py-2">{o.orderID}</td>
                <td className="px-4 py-2">
                  {o.customerName}
                  <div className="text-xs text-slate-400">{o.phoneNumber}</div>
                </td>
                <td className="px-4 py-2 max-w-[260px]">{o.address}</td>
                <td className="px-4 py-2">
                  <ul className="m-0 pl-4 list-disc">
                    {o.products?.map((p, idx) => (
                      <li key={idx} className="text-slate-300">
                        {p.product?.name || p.productId} × {p.quantity} @ ${p.unitPrice}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  <div>{o.paymentMethod}</div>
                  <div className="text-xs text-slate-400">{o.paymentStatus}</div>
                </td>
                <td className="px-4 py-2 font-semibold text-emerald-300">${o.totalPrice?.toFixed(2)}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 transition" onClick={() => onEdit(o)}>Edit</button>
                    <button className="px-3 py-1.5 rounded-lg border border-rose-400/40 text-rose-300 hover:bg-rose-500/10 transition" onClick={() => deleteOrder(o._id).then(fetchOrders)}>Delete</button>
                    <button className="px-3 py-1.5 rounded-lg border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 transition" onClick={() => handleInvoice(o._id)}>Invoice</button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
