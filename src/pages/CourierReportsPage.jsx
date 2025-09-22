import { useState } from "react";
import CourierForm from "../components/CourierForm";

export default function CourierReportsPage() {
  const [selectedCourier, setSelectedCourier] = useState(null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fuchsia-300 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]">🧭 Couriers</h1>
      <CourierForm selectedCourier={selectedCourier} onSuccess={() => setSelectedCourier(null)} />
    </div>
  );
}
