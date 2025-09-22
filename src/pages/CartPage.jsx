import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { createPublicOrder } from "../api/orders";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart, subtotal } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-[#1E40AF]">Your Cart</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
            >
              <FiTrash2 /> Clear cart
            </button>
          )}
        </div>

        {!items.length ? (
          <div className="rounded-xl border border-[#BFDBFE] bg-white p-8 text-center text-[#1E3A8A]">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.productId} className="flex items-center gap-4 rounded-xl border border-[#BFDBFE] bg-white p-4">
                  <div className="relative">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-24 h-24 object-cover rounded-lg border border-[#BFDBFE]"
                      onError={(e) => (e.currentTarget.style.opacity = 0)}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-[#1E40AF]">{it.name}</div>
                    {typeof it.stock === "number" && (
                      <div className="text-xs text-[#1E3A8A] mt-0.5">In stock: {it.stock}</div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm text-[#1E3A8A]">Qty</label>
                      <input
                        type="number"
                        min={1}
                        max={it.stock || 999}
                        value={it.quantity}
                        onChange={(e) =>
                          updateQty(it.productId, Math.max(1, Number(e.target.value || 1)))
                        }
                        className="w-24 rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
                      />
                    </div>
                  </div>

                  <div className="w-28 text-right font-bold text-[#1E40AF]">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(it.productId)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 h-fit rounded-xl border border-[#BFDBFE] bg-white p-5">
              <h2 className="text-lg font-semibold text-[#1E40AF] mb-4">Order Summary</h2>

              <div className="space-y-2 text-[#1E3A8A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E40AF]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <h3 className="mt-6 text-sm font-semibold text-[#1E40AF] mb-2">Shipping details</h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                  placeholder="Full name"
                  value={customer.customerName}
                  onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                />
                <input
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                  placeholder="Phone number"
                  value={customer.phoneNumber}
                  onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
                />
                <textarea
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 w-full text-[#1E3A8A] focus:outline-none"
                  rows={3}
                  placeholder="Address"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                />
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="mt-5 w-full px-4 py-3 rounded-lg bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition disabled:opacity-50"
              >
                {loading ? "Placing..." : "Pay & Confirm Order"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
