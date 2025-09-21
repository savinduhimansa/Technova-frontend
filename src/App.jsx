import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

// Sales Dashboard Layout + Pages
import SalesDashboardLayout from "./layouts/SalesDashboardLayout.jsx";
import SalesDashboardPage from "./pages/SalesDashboardPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import DeliveriesPage from "./pages/DeliveriesPage.jsx";
import CourierReportsPage from "./pages/CourierReportsPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Sales Dashboard */}
        <Route
          path="/salesdashboard"
          element={
            <ProtectedRoute>
              <SalesDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SalesDashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="couriers" element={<CourierReportsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
