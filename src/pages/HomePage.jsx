import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getProducts } from "../api/product";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import ChatWidget from "../components/ChatWidget";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProducts();
        setProducts(res.data || []);
      } catch (e) {
        console.error("Failed to load products", e);
      }
    })();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 🔮 Neon background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-fuchsia-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl animate-pulse [animation-delay:300ms]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <Header />

      {/* Products only */}
      <main className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl font-bold text-fuchsia-300 drop-shadow-[0_0_12px_rgba(236,72,153,0.7)] mb-8 text-center">
          🖥️ Shop Products
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-slate-400">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onAdd={addToCart} />
            ))}
          </div>
        )}
      </main>

      <ChatWidget />
    </div>
  );
}
