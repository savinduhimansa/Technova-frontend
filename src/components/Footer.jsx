import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-gradient-to-b from-[#2F6EE5] to-[#3B82F6] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h3 className="font-bold text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            TechNova
          </h3>
          <p className="mt-2 text-sm text-white/80">
            Future-ready gadgets. Curated by humans, powered by tech.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2">
          <Link
            to="/about"
            className="w-fit border border-white/25 text-white/90 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            About Us
          </Link>
          <Link
            to="/privacy"
            className="w-fit border border-white/25 text-white/90 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            Privacy Policy
          </Link>
          <Link
            to="/feedback"
            className="w-fit border border-white/25 text-white/90 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            Send Feedback
          </Link>
        </nav>

        {/* Contact */}
        <div className="text-sm">
          <p className="text-white/80">Questions?</p>
          <a
            href="mailto:support@technova.example"
            className="inline-block mt-2 border border-white/25 text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            support@technova.example
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/80 flex items-center justify-between">
          <span>© {new Date().getFullYear()} TechNova. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
