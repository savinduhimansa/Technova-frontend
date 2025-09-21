import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClasses = ({ isActive }) =>
  `block px-3 py-2 rounded-lg border ${
    isActive
      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300"
      : "border-slate-700/60 text-slate-300 hover:bg-slate-800/60"
  } transition`;

export default function SalesSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="h-screen w-64 border-r border-fuchsia-500/30 bg-slate-950/80 fixed left-0 top-0 backdrop-blur">
      <div className="h-14 border-b border-fuchsia-500/20 flex items-center px-4 font-semibold text-fuchsia-300">
        TechNova CRM
      </div>

      <div className="p-3 space-y-1">
        <NavLink to="/salesdashboard" end className={linkClasses}>
          📊 Sales Dashboard
        </NavLink>
        <NavLink to="/salesdashboard/orders" className={linkClasses}>
          📦 Orders
        </NavLink>
        <NavLink to="/salesdashboard/deliveries" className={linkClasses}>
          🚚 Deliveries
        </NavLink>
        <NavLink to="/salesdashboard/couriers" className={linkClasses}>
          🧭 Couriers
        </NavLink>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-fuchsia-500/20">
        <div className="text-xs text-slate-400 mb-2">
          Signed in as <b className="text-slate-200">{user?.email}</b>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="w-full px-3 py-2 rounded-lg border border-rose-400/40 text-rose-300 hover:bg-rose-500/10 text-left transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
