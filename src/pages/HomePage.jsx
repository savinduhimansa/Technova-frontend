import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getProductsList } from "../api/product";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import ChatWidget from "../components/ChatWidget";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try { setProducts(await getProductsList()); }
      catch (e) { console.error("Failed to load products", e); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-[#1E40AF] mb-8">Shop Products</h2>
        {products.length === 0 ? (
          <p className="text-center text-[#1E3A8A]">No products available.</p>
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
