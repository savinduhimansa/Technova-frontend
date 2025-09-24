import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

import ForgetPassword from "./pages/forgetPassword.jsx";
import ResetPassword from "./pages/resetPassword.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import StaffProfile from "./pages/StaffProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";

// Sales Dashboard Layout + Pages
import SalesDashboardLayout from "./layouts/SalesDashboardLayout.jsx";
import SalesDashboardPage from "./pages/SalesDashboardPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import DeliveriesPage from "./pages/DeliveriesPage.jsx";
import CourierReportsPage from "./pages/CourierReportsPage.jsx";

// Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard/adminDashboard.jsx";


// Inventory Management Pages
import AppShell from "./pages/AppShell.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InventoryHome from "./pages/inventoryHome.jsx";   // was inventoryHome.jsx — ensure case matches file
import InventoryAdd from "./pages/inventoryAdd.jsx";
import InventoryEdit from "./pages/InventoryEdit.jsx";
import AddSupplier from "./pages/AddSupplier.jsx";
import SupplierEdit from "./pages/SupplierEdit.jsx";
import Suppliers from "./pages/suppliers.jsx";   

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* ---------- Public routes ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/profile" element={<UserProfile />} />       {/* user self-profile */}
        <Route path="/staff/profile" element={<StaffProfile />} />{/* staff self-profile */}

        {/* ---------- Sales dashboard (only salesManager) ---------- */}
        <Route
          path="/salesdashboard/*"
          element={
            <ProtectedRoute allow={["salesManager"]}>
              <SalesDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SalesDashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="couriers" element={<CourierReportsPage />} />
        </Route>

        {/* ---------- Admin dashboard (only admin) ---------- */}
        <Route
          path="/admindashboard/*"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

         {/* ---------- INVENTORY APP: protected mini-app under /inv/* ---------- */}
        <Route
          path="/inv/*"
          element={
            <ProtectedRoute allow={["inventoryManager", "admin"]}>
              <AppShell />
            </ProtectedRoute>
          }
        >
          {/* default -> /inv/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Inventory main pages */}
          <Route path="inventory" element={<InventoryHome />} />
          <Route path="suppliers" element={<Suppliers />} />

          {/* Inventory CRUD pages */}
          <Route path="products/new" element={<InventoryAdd />} />
          <Route path="products/edit" element={<InventoryEdit />} />   {/* reads ?id= */}
          <Route path="suppliers/new" element={<AddSupplier />} />
          <Route path="suppliers/edit" element={<SupplierEdit />} />   {/* reads ?id= */}
        </Route>

        {/* ---------- Catch-all ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
