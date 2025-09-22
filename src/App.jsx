import { Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-950 via-sky-950 to-blue-900 text-slate-100">
      <header className="border-b border-slate-800/60 sticky top-0 backdrop-blur bg-slate-950/40">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/builder" className="text-xl font-semibold tracking-wide">
            <span className="text-sky-400">TechNova</span> PC Builder
          </Link>
          <nav className="flex gap-4">
            <Link className="hover:text-sky-300" to="/builder">Builder</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
