import Header from "../components/Header";
import { useEffect, useState } from "react";
// import { getProductsList } from "../api/product";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import ChatWidget from "../components/ChatWidget";
import Footer from "../components/Footer";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        setProducts(await getProductsList());
      } catch (e) {
        console.error("Failed to load products", e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEAFE] via-white to-[#E0ECFF] text-[#1E3A8A] flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-md">
        <h1 className="text-4xl font-bold mb-2">Welcome to TechNova</h1>
        <p className="text-lg">Your trusted partner in technology solutions</p>
      </section>

      {/* Products */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Featured Products
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products available
            </p>
          )}
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}