import { useState } from "react";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const bump = () => setRefresh((k) => k + 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fuchsia-300 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]">📦 Orders</h1>

      <OrderForm
        selectedOrder={selectedOrder}
        onSuccess={() => {
          setSelectedOrder(null); // reset form after save
          bump();                 // 🔁 refresh OrderList
        }}
      />

      <OrderList onEdit={setSelectedOrder} refresh={refresh} />
    </div>
  );
}
