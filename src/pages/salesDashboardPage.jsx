import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/salesdashboard";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function SalesDashboardPage() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (!stats) return <p className="text-slate-300">Loading...</p>;

  const COLORS = ["#22d3ee", "#a78bfa", "#f472b6", "#34d399"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">📈 Dashboard</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-4">
          <div className="text-slate-400">Orders this Month</div>
          <div className="text-3xl font-bold text-cyan-300">{stats.totalOrdersMonth}</div>
        </div>
        <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 p-4">
          <div className="text-slate-400">Processing Orders</div>
          <div className="text-3xl font-bold text-fuchsia-300">{stats.processingOrders}</div>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-slate-900/70 p-4">
          <div className="text-slate-400">Completed Orders</div>
          <div className="text-3xl font-bold text-emerald-300">{stats.completedOrders}</div>
        </div>
        <div className="rounded-2xl border border-yellow-400/30 bg-slate-900/70 p-4">
          <div className="text-slate-400">Revenue</div>
          <div className="text-3xl font-bold text-yellow-300">${stats.revenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 p-4 flex-1">
          <h3 className="text-lg font-semibold text-fuchsia-300 mb-3">Courier Performance</h3>
          <div className="overflow-auto">
            <PieChart width={520} height={380}>
              <Pie data={stats.courierStats} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={140} label>
                {stats.courierStats.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-4 flex-1">
          <h3 className="text-lg font-semibold text-cyan-300 mb-3">Sales by Product</h3>
          <div className="overflow-auto">
            <BarChart width={560} height={380} data={stats.productStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#22d3ee" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}