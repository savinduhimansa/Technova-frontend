import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      alert("Registered successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(217,70,239,0.18)]">
        <h2 className="text-xl font-semibold text-fuchsia-300 mb-4">Create account</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-400 mb-1">First name</label>
            <input className="w-full rounded-lg bg-slate-800/80 border border-fuchsia-400/40 px-3 py-2 text-slate-100" name="firstName" value={form.firstName} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Last name</label>
            <input className="w-full rounded-lg bg-slate-800/80 border border-fuchsia-400/40 px-3 py-2 text-slate-100" name="lastName" value={form.lastName} onChange={onChange} required />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input className="w-full rounded-lg bg-slate-800/80 border border-fuchsia-400/40 px-3 py-2 text-slate-100" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="mt-3">
          <label className="block text-sm text-slate-400 mb-1">Password</label>
          <input className="w-full rounded-lg bg-slate-800/80 border border-fuchsia-400/40 px-3 py-2 text-slate-100" name="password" type="password" value={form.password} onChange={onChange} required />
        </div>
        <div className="mt-3">
          <label className="block text-sm text-slate-400 mb-1">Phone</label>
          <input className="w-full rounded-lg bg-slate-800/80 border border-fuchsia-400/40 px-3 py-2 text-slate-100" name="phone" value={form.phone} onChange={onChange} />
        </div>
        <button className="w-full mt-4 px-4 py-2 rounded-lg bg-fuchsia-500/90 text-slate-900 font-semibold hover:bg-fuchsia-400 transition disabled:opacity-50" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>
        <div className="text-sm text-center text-slate-300 mt-3">
          Already have an account? <Link className="text-cyan-300 hover:underline" to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
