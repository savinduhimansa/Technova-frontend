import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { isAuthed, user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const count = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <header className="w-full sticky top-0 z-50 border-b border-fuchsia-500/20 bg-slate-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-lg text-fuchsia-300 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]"
        >
          TechNova
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative px-3 py-1.5 rounded-lg border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 transition"
          >
            🛒 Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-cyan-500 text-slate-900 rounded-full px-1.5 py-0.5 shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                {count}
              </span>
            )}
          </Link>

          {!isAuthed ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg border border-fuchsia-400/40 text-fuchsia-300 hover:bg-fuchsia-500/10 transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-lg bg-cyan-500/90 text-slate-900 font-semibold hover:bg-cyan-400 transition shadow-[0_0_18px_rgba(34,211,238,0.45)]"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-300 hidden sm:block">
                Hi, {user?.email}
              </span>
              <Link
                to="/salesdashboard"
                className="px-3 py-1.5 rounded-lg border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-3 py-1.5 rounded-lg border border-rose-400/40 text-rose-300 hover:bg-rose-500/10 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
