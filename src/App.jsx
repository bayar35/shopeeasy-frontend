import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./features/user/userSlice";
import Wishlist from "./Wishlist/Wishlist";
import AIChat from "./components/AIChat";
import Analytics from "./Admin/Analytics";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";

// User
import Register from "./User/Register";
import Login from "./User/Login";
import Profile from "./User/Profile";
import UpdateProfile from "./User/UpdateProfile";
import ForgotPassword from "./User/ForgotPassword";
import UpdatePassword from "./User/UpdatePassword";
import ResetPassword from "./User/ResetPassword";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Cart
import Cart from "./Cart/Cart";
import Shipping from "./Cart/Shipping";
import OrderConfirm from "./Cart/OrderConfirm";
import Payment from "./Cart/Payment";
import PaymentSuccess from "./Cart/PaymentSuccess";

// Orders
import MyOrders from "./Orders/MyOrders";
import OrderDetails from "./Orders/OrderDetails";

// Admin
import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/Dashboard";
import ProductList from "./Admin/ProductList";
import CreateProduct from "./Admin/CreateProduct";
import UpdateProduct from "./Admin/UpdateProduct";
import UsersList from "./Admin/UsersList";
import UpdateRole from "./Admin/UpdateRole";
import OrdersList from "./Admin/OrdersList";
import UpdateOrder from "./Admin/UpdateOrder";
import ReviewsList from "./Admin/ReviewsList";

function App() {
  const dispatch = useDispatch();
  const [runtimeError, setRuntimeError] = useState(null);

  useEffect(() => {
    try {
      console.log("🚀 APP LOADING: loadUser дуудагдаж байна...");
      dispatch(loadUser());
    } catch (err) {
      console.error("💥 useEffect дотор алдаа гарлаа:", err);
      setRuntimeError(err.message);
    }
  }, [dispatch]);

  // ✅ ТАНЫ САНАА: Хэрэв вэб дотор алдаа гарвал цагаан хуудас биш, улаан бичгээр алдааг дэлгэцэнд харуулна
  if (runtimeError) {
    return (
      <div style={{ padding: "50px", color: "red", background: "#fee" }}>
        <h2>💥 React Runtime Алдаа баригдлаа:</h2>
        <p>{runtimeError}</p>
      </div>
    );
  }

  try {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="/cart" element={<Cart />} />

            <Route
              path="/wishlist"
              element={<ProtectedRoute element={<Wishlist />} />}
            />

            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/profile/update"
              element={<ProtectedRoute element={<UpdateProfile />} />}
            />
            <Route
              path="/password/update"
              element={<ProtectedRoute element={<UpdatePassword />} />}
            />
            <Route
              path="/shipping"
              element={<ProtectedRoute element={<Shipping />} />}
            />
            <Route
              path="/order/confirm"
              element={<ProtectedRoute element={<OrderConfirm />} />}
            />
            <Route
              path="/process/payment"
              element={<ProtectedRoute element={<Payment />} />}
            />
            <Route
              path="/paymentSuccess"
              element={<ProtectedRoute element={<PaymentSuccess />} />}
            />
            <Route
              path="/order/:orderId"
              element={<ProtectedRoute element={<OrderDetails />} />}
            />
            <Route
              path="/orders/user"
              element={<ProtectedRoute element={<MyOrders />} />}
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute element={<AdminLayout />} adminOnly={true} />
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="products" element={<ProductList />} />
              <Route path="product/create" element={<CreateProduct />} />
              <Route path="product/:updateId" element={<UpdateProduct />} />
              <Route path="users" element={<UsersList />} />
              <Route path="user/:userId" element={<UpdateRole />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="order/:orderId" element={<UpdateOrder />} />
              <Route path="reviews" element={<ReviewsList />} />
            </Route>
          </Routes>
        </Router>
        <AIChat />
      </>
    );
  } catch (renderError) {
    console.error("💥 Render хийх үед алдаа гарлаа:", renderError);
    return (
      <div style={{ padding: "50px", color: "red", background: "#fee" }}>
        <h2>💥 Render Алдаа:</h2>
        <p>{renderError.message}</p>
        <p>Архив, импорт эсвэл дотоод аль нэг хуудасны файлаас болж унав.</p>
      </div>
    );
  }
}

export default App;
