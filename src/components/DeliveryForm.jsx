import { useEffect, useState } from "react";
import { createDelivery } from "../api/deliveries";
import { getConfirmedOrders } from "../api/orders";

export default function DeliveryForm({ onSuccess }) {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ orderId: "", courierService: "", scheduledDate: "" });

  useEffect(() => { (async () => {
    const res = await getConfirmedOrders(); setOrders(res.data);
  })(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createDelivery(form);
      setForm({ orderId: "", courierService: "", scheduledDate: "" });
      onSuccess?.();
    } catch (e) { alert(e?.response?.data?.message || "Error creating delivery"); }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur">
      <h2 className="text-xl font-bold text-cyan-300 mb-4">Assign Delivery</h2>

      <label className="block mb-3 text-slate-200">
        <span className="text-sm text-slate-400">Order (Confirmed)</span>
        <select
          value={form.orderId}
          onChange={e => setForm({ ...form, orderId: e.target.value })}
          required
          className="mt-1 w-full rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
        >
          <option value="">Select OrderID</option>
          {orders.map(o => <option key={o.orderID} value={o.orderID}>{o.orderID} - {o.customerName}</option>)}
        </select>
      </label>

      <label className="block mb-3 text-slate-200">
        <span className="text-sm text-slate-400">Courier Service</span>
        <select
          value={form.courierService}
          onChange={e => setForm({ ...form, courierService: e.target.value })}
          required
          className="mt-1 w-full rounded-lg bg-slate-800/80 border border-fuchsia-400/40 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
        >
          <option value="">Select Service</option>
          <option value="Express">Express</option>
          <option value="DHL">DHL</option>
          <option value="Fedex">Fedex</option>
        </select>
      </label>

      <label className="block mb-4 text-slate-200">
        <span className="text-sm text-slate-400">Scheduled Date/Time</span>
        <input
          type="datetime-local"
          value={form.scheduledDate}
          onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
          required
          className="mt-1 w-full rounded-lg bg-slate-800/80 border border-emerald-400/40 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        />
      </label>

      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-cyan-500/90 text-slate-900 font-semibold hover:bg-cyan-400 transition shadow-[0_0_18px_rgba(34,211,238,0.45)]"
      >
        Assign Delivery
      </button>
    </form>
  );
}
