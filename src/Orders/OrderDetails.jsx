import React, { useEffect } from "react";
import "../OrderStyles/OrderDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, removeErrors } from "../features/order/orderSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { ArrowLeft } from "lucide-react";

function OrderDetails() {
  const { orderId } = useParams();
  const { order, loading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  if (!order) {
    return (
      <>
        <PageTitle title="Order Details" />
        <Navbar />
        {loading ? (
          <Loader />
        ) : (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <p>Захиалга олдсонгүй</p>
            <Link
              to="/orders/user"
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "12px 24px",
                background: "#1d1d1f",
                color: "white",
                borderRadius: "999px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              ← Миний захиалгууд
            </Link>
          </div>
        )}
        <Footer />
      </>
    );
  }

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    taxPrice,
    shippingPrice,
    itemPrice,
    paidAt,
  } = order;

  const paymentStatus =
    paymentInfo?.status === "succeeded" ||
    paymentInfo?.status === "Cash on Delivery"
      ? "Paid"
      : "Not Paid";

  const finalOrderStatus =
    paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  const orderStatusClass =
    finalOrderStatus === "Delivered"
      ? "status-tag delivered"
      : `status-tag ${finalOrderStatus?.toLowerCase()}`;

  const paymentStatusClass = `pay-tap ${
    paymentStatus === "Paid" ? "paid" : "not-paid"
  }`;

  return (
    <>
      <PageTitle title={`Order ${orderId}`} />
      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <div className="order-box">
          {/* ✨ BACK BUTTON - ШИНЭ */}
          <button
            onClick={() => navigate("/orders/user")}
            className="back-button"
          >
            <ArrowLeft size={18} />
            Буцах
          </button>

          {/* Order Items table */}
          <div className="table-block">
            <h2 className="table-title">Order Items</h2>
            <table className="table-main">
              <thead>
                <tr>
                  <th className="head-cell">Image</th>
                  <th className="head-cell">Name</th>
                  <th className="head-cell">Quantity</th>
                  <th className="head-cell">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr className="table-row" key={index}>
                    <td className="table-cell">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-img"
                      />
                    </td>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.quantity}</td>
                    <td className="table-cell">
                      {item.price.toLocaleString()}₮
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Info table */}
          <div className="table-block">
            <h2 className="table-title">Shipping Info</h2>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell">Address</th>
                  <td className="table-cell">
                    {shippingInfo.address}, {shippingInfo.city},{" "}
                    {shippingInfo.state}, {shippingInfo.country},{" "}
                    {shippingInfo.pinCode || shippingInfo.pincode}
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Phone</th>
                  <td className="table-cell">{shippingInfo.phoneNo}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="table-block">
            <h2 className="table-title">Order Summary</h2>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell">Order Status</th>
                  <td className="table-cell">
                    <span className={orderStatusClass}>
                      {finalOrderStatus}
                    </span>
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Payment</th>
                  <td className="table-cell">
                    <span className={paymentStatusClass}>{paymentStatus}</span>
                  </td>
                </tr>

                {paidAt && (
                  <tr className="table-row">
                    <th className="table-cell">Paid At</th>
                    <td className="table-cell">
                      {new Date(paidAt).toLocaleString()}
                    </td>
                  </tr>
                )}

                <tr className="table-row">
                  <th className="table-cell">Items Price</th>
                  <td className="table-cell">
                    {itemPrice?.toLocaleString()}₮
                  </td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Tax Price</th>
                  <td className="table-cell">
                    {taxPrice?.toLocaleString()}₮
                  </td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Shipping Price</th>
                  <td className="table-cell">
                    {shippingPrice?.toLocaleString()}₮
                  </td>
                </tr>

                <tr className="table-row total-row">
                  <th className="table-cell">Total Price</th>
                  <td className="table-cell">
                    <strong>{totalPrice?.toLocaleString()}₮</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ✨ BOTTOM BACK BUTTON */}
          <div className="order-actions">
            <Link to="/orders/user" className="btn-back-bottom">
              <ArrowLeft size={18} />
              Миний захиалгууд руу буцах
            </Link>
            <Link to="/products" className="btn-shop-more">
              Худалдан авалт үргэлжлүүлэх
            </Link>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default OrderDetails;