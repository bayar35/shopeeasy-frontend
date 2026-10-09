import React from "react";
import "../CartStyles/OrderConfirm.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import CheckoutPath from "./CheckoutPath";
import { ArrowRight, ArrowLeft } from "lucide-react";

function OrderConfirm() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = Number((subtotal * 0.1).toFixed(2));
  const shippingCharges = subtotal > 500000 ? 0 : 5000;
  const total = subtotal + tax + shippingCharges;

  const proceedToPayment = () => {
    const data = { subtotal, tax, shippingCharges, total };
    sessionStorage.setItem("orderItem", JSON.stringify(data));
    navigate("/process/payment");
  };

  const fullAddress = shippingInfo?.address || "";

  // 🎨 Inline Style-н туслах функцууд
  const thStyle = {
    padding: "16px 20px",
    backgroundColor: "#fafafa",
    color: "#6e6e73",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #e8e8ed",
    verticalAlign: "middle",
  };

  const tdStyle = {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#1d1d1f",
    fontWeight: "500",
    verticalAlign: "middle",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    border: "1px solid #e8e8ed",
    borderRadius: "16px",
    overflow: "hidden",
    tableLayout: "fixed",
  };

  const captionStyle = {
    textAlign: "left",
    padding: "16px 24px",
    fontSize: "18px",
    fontWeight: "700",
    backgroundColor: "#f5f5f7",
    color: "#1d1d1f",
    borderBottom: "1px solid #e8e8ed",
    captionSide: "top",
  };

  return (
    <>
      <style>{`
        .confirm-container {
          max-width: 1100px !important;
          margin: 40px auto !important;
          padding: 32px 24px !important;
          background: #ffffff !important;
          border-radius: 24px !important;
          border: 1px solid #e8e8ed !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
        }
        .confirm-header {
          font-size: 32px !important;
          font-weight: 900 !important;
          text-align: center !important;
          margin-bottom: 32px !important;
          color: #1d1d1f !important;
        }
        .confirm-buttons {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 16px !important;
          margin-top: 32px !important;
        }
        .back-to-shipping-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 18px 32px !important;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%) !important;
          color: white !important;
          border-radius: 999px !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          text-decoration: none !important;
          text-transform: uppercase !important;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25) !important;
        }
        .proceed-button {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 18px 32px !important;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: 999px !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          cursor: pointer !important;
          text-transform: uppercase !important;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25) !important;
        }
        .cart-item-img {
          width: 64px !important;
          height: 64px !important;
          border-radius: 12px !important;
          object-fit: cover !important;
          display: block !important;
          margin: 0 auto !important;
          border: 1px solid #e8e8ed !important;
        }
      `}</style>

      <PageTitle title="Захиалга баталгаажуулах" />
      <Navbar />
      <CheckoutPath activePath={1} />

      <div className="confirm-container">
        <h1 className="confirm-header">Захиалга баталгаажуулах</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
          {/* 1. SHIPPING DETAILS - 3 багана */}
          <table style={tableStyle}>
            <caption style={captionStyle}>Хүргэлтийн мэдээлэл</caption>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "25%", textAlign: "left" }}>
                  Хүлээн авагч
                </th>
                <th style={{ ...thStyle, width: "20%", textAlign: "center" }}>
                  Утас
                </th>
                <th style={{ ...thStyle, width: "55%", textAlign: "left" }}>
                  Хаяг
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f0f0f5" }}>
                <td style={{ ...tdStyle, textAlign: "left" }}>
                  {shippingInfo?.name || user?.name}
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {shippingInfo?.phoneNumber}
                </td>
                <td style={{ ...tdStyle, textAlign: "left" }}>{fullAddress}</td>
              </tr>
            </tbody>
          </table>

          {/* 2. CART ITEMS - 5 багана */}
          <table style={tableStyle}>
            <caption style={captionStyle}>Сагсны бүтээгдэхүүн</caption>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "12%", textAlign: "center" }}>
                  Зураг
                </th>
                <th style={{ ...thStyle, width: "33%", textAlign: "left" }}>
                  Бүтээгдэхүүн
                </th>
                <th style={{ ...thStyle, width: "18%", textAlign: "center" }}>
                  Үнэ
                </th>
                <th style={{ ...thStyle, width: "12%", textAlign: "center" }}>
                  Тоо
                </th>
                <th style={{ ...thStyle, width: "25%", textAlign: "center" }}>
                  Нийт үнэ
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <tr key={item.product} style={{ borderBottom: "1px solid #f0f0f5" }}>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img"
                      />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "left" }}>{item.name}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {item.price?.toLocaleString()}₮
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {item.quantity}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {(item.price * item.quantity)?.toLocaleString()}₮
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ ...tdStyle, textAlign: "center", padding: "20px" }}
                  >
                    Сагс хоосон байна
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 3. ORDER SUMMARY - 4 багана */}
          <table style={tableStyle}>
            <caption style={captionStyle}>Захиалгын дүн</caption>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "25%", textAlign: "left" }}>
                  Дэд нийт
                </th>
                <th style={{ ...thStyle, width: "25%", textAlign: "center" }}>
                  Хүргэлт
                </th>
                <th style={{ ...thStyle, width: "25%", textAlign: "center" }}>
                  НӨАТ (10%)
                </th>
                <th style={{ ...thStyle, width: "25%", textAlign: "right" }}>
                  Нийт
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, textAlign: "left" }}>
                  {subtotal.toLocaleString()}₮
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {shippingCharges === 0
                    ? "Үнэгүй"
                    : `${shippingCharges.toLocaleString()}₮`}
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {tax.toLocaleString()}₮
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "right",
                    color: "#ff6b35",
                    fontWeight: "800",
                    fontSize: "16px",
                  }}
                >
                  {total.toLocaleString()}₮
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="confirm-buttons">
          <Link to="/shipping" className="back-to-shipping-btn">
            <ArrowLeft size={18} />
            Буцах
          </Link>
          <button className="proceed-button" onClick={proceedToPayment}>
            Төлбөр төлөх <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderConfirm;