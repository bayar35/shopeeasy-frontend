import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ element, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ⭐ Хэрэв `element` байвал түүнийг, байхгүй бол `<Outlet />`
  return element ? element : <Outlet />;
}

export default ProtectedRoute;