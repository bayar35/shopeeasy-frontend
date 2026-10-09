import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  AddBox,
  Star,
  Inventory,
  People,
  ShoppingCart,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../AdminStyles/AdminLayout.css";

function AdminLayout({ children }) {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
    { path: "/admin/products", label: "All Products", icon: Inventory },
    { path: "/admin/product/create", label: "Create Product", icon: AddBox },
    { path: "/admin/users", label: "All Users", icon: People },
    { path: "/admin/orders", label: "All Orders", icon: ShoppingCart },
    { path: "/admin/reviews", label: "All Reviews", icon: Star },
  ];

  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Navbar />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <DashboardIcon className="admin-logo-icon" />
            <span>Admin Dashboard</span>
          </div>

          <nav className="admin-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item ${
                    isActive(item.path) ? "active" : ""
                  }`}
                >
                  <Icon className="admin-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="admin-content">{children}</main>
      </div>
      <Footer />
    </>
  );
}

export default AdminLayout;