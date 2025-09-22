import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiLogOut, FiLogIn, FiUserPlus, FiLayout } from "react-icons/fi";

function getRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.role || null;
  } catch { return null; }
}

export default function Header() {
  const { items } = useCart();
  const navigate = useNavigate();
  const role = getRole();
  const authed = !!role;
  const count = items.reduce((s, it) => s + it.quantity, 0);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const dash =
    role === "salesManager" ? { to: "/salesdashboard", label: "Sales Dashboard" }
    : role === "admin" ? { to: "/admindashboard", label: "Admin Dashboard" }
    : null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#BFDBFE]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-[#1E40AF]">TechNova</Link>

        <nav className="flex items-center gap-3">
          <Link to="/cart" className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition">
            <FiShoppingCart />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-[#3B82F6] text-white rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </Link>

          {!authed ? (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition">
                <FiLogIn /> Sign in
              </Link>
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-[#3B82F6] text-white hover:bg-[#2563EB] transition">
                <FiUserPlus /> Sign up
              </Link>
            </>
          ) : (
            <>
              {dash && (
                <Link to={dash.to} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition">
                  <FiLayout /> {dash.label}
                </Link>
              )}
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition">
                <FiLogOut /> Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
