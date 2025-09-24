// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLogOut, FiLogIn, FiUserPlus, FiLayout } from "react-icons/fi";

/* Read role from JWT in localStorage (no context needed) */
function getRoleFromToken() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    // normalize: admin / inventoryManager / productManager / technician / salesManager
    const r = String(payload?.role || "").toLowerCase().replace(/[\s_-]/g, "");
    return r || null;
  } catch {
    return null;
  }
}

/* Map role -> dashboard path + label */
function roleToDashboard(roleNorm) {
  switch (roleNorm) {
    case "admin":
      return { to: "/admindashboard", label: "Admin Dashboard" };
    case "inventorymanager":
      return { to: "/inv/dashboard", label: "Inventory Dashboard" };
    case "productmanager":
      return { to: "/productManager", label: "Product Manager" };
    case "technician":
      return { to: "/technician", label: "Technician" };
    case "salesmanager":
      return { to: "/salesdashboard", label: "Sales Dashboard" };
    default:
      return null;
  }
}

export default function Header() {
  const navigate = useNavigate();

  const roleNorm = getRoleFromToken();      // e.g., "admin", "inventorymanager", etc.
  const authed = !!roleNorm;
  const dash = roleToDashboard(roleNorm);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authType");
    } catch {}
    navigate("/");
  };

  return (
    <header className="w-full sticky top-0 z-50 border-b border-[#BFDBFE] bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="font-bold text-lg text-[#1E40AF]"
        >
          TechNova
        </Link>

        {/* Right side actions */}
        <nav className="flex items-center gap-3">
          {/* Cart link (no context required) */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
            title="Cart"
          >
            <FiShoppingCart />
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {!authed ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
              >
                <FiLogIn />
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-[#3B82F6] text-white hover:bg-[#2563EB] transition"
              >
                <FiUserPlus />
                Sign up
              </Link>
            </>
          ) : (
            <>
              {dash && (
                <Link
                  to={dash.to}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
                >
                  <FiLayout />
                  {dash.label}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
