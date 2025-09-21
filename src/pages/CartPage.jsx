import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { createPublicOrder } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart, subtotal } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ customerName: "", phoneNumber: "", address: "" });
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!token) return alert("Please login first.");
    if (!items.length) return alert("Cart is empty.");
    if (!customer.customerName || !customer.phoneNumber || !customer.address) {
      return alert("Please fill name, phone & address.");
    }

    try {
      setLoading(true);
      const payload = {
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        products: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        discount: 0,
        paymentMethod: "Card",
        status: "Confirmed",
      };
      await createPublicOrder(payload);
      clearCart();
      alert("Order placed!");
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 🔮 Ambient neon background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-8 left-10 w-80 h-80 bg-fuchsia-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/25 rounded-full blur-3xl animate-pulse [animation-delay:250ms]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-fuchsia-300 drop-shadow-[0_0_14px_rgba(236,72,153,0.7)]">
            Your Cart
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="px-3 py-1.5 rounded-lg border border-rose-400/40 text-rose-300 hover:bg-rose-500/10 transition"
            >
              Clear cart
            </button>
          )}
        </div>

        {!items.length ? (
          <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/70 p-8 text-center text-slate-300 shadow-[0_0_26px_rgba(217,70,239,0.14)]">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div
                  key={it.productId}
                  className="flex items-center gap-4 rounded-2xl border border-fuchsia-500/30 bg-slate-900/60 p-4 shadow-[0_0_24px_rgba(217,70,239,0.14)]"
                >
                  <div className="relative">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-24 h-24 object-cover rounded-xl border border-slate-700/60"
                    />
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                      ${it.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-slate-100">{it.name}</div>
                    {typeof it.stock === "number" && (
                      <div className="text-xs text-slate-400 mt-0.5">In stock: {it.stock}</div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm text-slate-300">Qty</label>
                      <input
                        type="number"
                        min={1}
                        max={it.stock || 999}
                        value={it.quantity}
                        onChange={(e) =>
                          updateQty(it.productId, Math.max(1, Number(e.target.value || 1)))
                        }
                        className="w-24 rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                      />
                    </div>
                  </div>

                  <div className="w-28 text-right font-bold text-emerald-300">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(it.productId)}
                    className="px-3 py-2 rounded-lg border border-rose-400/40 text-rose-300 hover:bg-rose-500/10 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Summary / checkout */}
            <div className="lg:sticky lg:top-24 h-fit rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-5 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
              <h2 className="text-lg font-semibold text-cyan-300 mb-4">Order Summary</h2>

              <div className="space-y-2 text-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-emerald-300">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="my-5 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

              <h3 className="text-sm font-semibold text-slate-300 mb-2">Shipping details</h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  className="rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none"
                  placeholder="Full name"
                  value={customer.customerName}
                  onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                />
                <input
                  className="rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 text-slate-100 focus:outline-none"
                  placeholder="Phone number"
                  value={customer.phoneNumber}
                  onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
                />
                <textarea
                  className="rounded-lg bg-slate-800/80 border border-cyan-400/40 px-3 py-2 w-full text-slate-100 focus:outline-none"
                  rows={3}
                  placeholder="Address"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                />
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="mt-5 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-semibold hover:scale-[1.01] transition disabled:opacity-50 shadow-[0_0_18px_rgba(6,182,212,0.45)]"
              >
                {loading ? "Placing..." : "Pay & Confirm Order"}
              </button>

              <p className="mt-3 text-xs text-slate-400">
                By placing the order, you agree to our terms and privacy policy.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
