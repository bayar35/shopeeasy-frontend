import React, { useEffect } from "react";
import "../AdminStyles/Dashboard.css";
import PageTitle from "../components/PageTitle";
import {
  Star,
  AttachMoney,
  CheckCircle,
  Instagram,
  Inventory,
  LinkedIn,
  ShoppingCart,
  YouTube,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  fetchAllOrders,
} from "../features/admin/adminSlice";

function Dashboard() {
  const { products, orders, totalAmount } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const outOfStock =
    products?.filter((product) => product.stock === 0).length || 0;
  const inStock =
    products?.filter((product) => product.stock > 0).length || 0;
  const totalReviews =
    products?.reduce(
      (acc, product) => acc + (product.reviews?.length || 0),
      0
    ) || 0;

  return (
    <>
      <PageTitle title="Admin Dashboard" />
      <div className="main-content">
        <div className="stats-grid">
          <div className="stat-box">
            <Inventory className="icon" />
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>

          <div className="stat-box">
            <ShoppingCart className="icon" />
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>

          <div className="stat-box">
            <Star className="icon" />
            <h3>Total Reviews</h3>
            <p>{totalReviews}</p>
          </div>

          <div className="stat-box">
            <AttachMoney className="icon" />
            <h3>Total Revenue</h3>
            <p>{Number(totalAmount || 0).toFixed(2)}₮</p>
          </div>

          <div className="stat-box">
            <Inventory className="icon" />
            <h3>Out Of Stock</h3>
            <p>{outOfStock}</p>
          </div>

          <div className="stat-box">
            <CheckCircle className="icon" />
            <h3>In Stock</h3>
            <p>{inStock}</p>
          </div>
        </div>

        <div className="social-stats">
          <div className="social-box instagram">
            <Instagram />
            <h3>Instagram</h3>
            <p>123K Followers</p>
            <p>12 posts</p>
          </div>
          <div className="social-box linkedin">
            <LinkedIn />
            <h3>LinkedIn</h3>
            <p>55K Followers</p>
            <p>6 posts</p>
          </div>
          <div className="social-box youtube">
            <YouTube />
            <h3>Youtube</h3>
            <p>45K Followers</p>
            <p>500 posts</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;