import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(form.email, form.password);
      login(res.data.token);
      navigate("/salesdashboard", { replace: true }); // redirect here
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
      >
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">Sign in</h2>

        <div className="mb-3">
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Password</label>
          <input
            name="password"
            type="password"
            className="w-full rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-cyan-500/90 text-slate-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="text-sm text-center text-slate-300 mt-3">
          New here?{" "}
          <Link className="text-fuchsia-300 hover:underline" to="/signup">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
