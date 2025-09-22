import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import PCBuilder from "./pages/PCBuilder.jsx";
import BuildPreview from "./pages/BuildPreview.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Navigate to="/builder" replace />} />
          <Route path="/builder" element={<PCBuilder />} />
          <Route path="/preview/:buildId" element={<BuildPreview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
