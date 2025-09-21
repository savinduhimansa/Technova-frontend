import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireSales = true }) {
  const { isAuthed, isSales } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (requireSales && !isSales) return <Navigate to="/" replace />;
  return children;
}
