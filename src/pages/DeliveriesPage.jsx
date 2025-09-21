import { useState } from "react";
import DeliveryForm from "../components/DeliveryForm";
import DeliveryList from "../components/DeliveryList";

export default function DeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [refresh, setRefresh] = useState(0); // 🔁

  const bump = () => setRefresh((k) => k + 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">🚚 Deliveries</h1>

      <DeliveryForm
        selectedDelivery={selectedDelivery}
        onSuccess={() => {
          setSelectedDelivery(null);
          bump(); // 🔁 after creating a delivery
        }}
      />

      <DeliveryList onEdit={setSelectedDelivery} refresh={refresh} />
    </div>
  );
}
