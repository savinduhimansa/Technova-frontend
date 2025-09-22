import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Builder from "./pages/Builder.jsx";
import BuildPreview from "./pages/BuildPreview.jsx";
import MyBuilds from "./pages/MyBuilds.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "build", element: <Builder /> },
      { path: "preview", element: <BuildPreview /> },
      { path: "my-builds", element: <MyBuilds /> },
      { path: "admin", element: <AdminDashboard /> },
    ],
  },
]);

export default router;
