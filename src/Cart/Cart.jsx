import React from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";

function Cart() {
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shippingCharges = subtotal > 500000 ? 0 : 5000;
  const total = subtotal + tax + shippingCharges;

  // ✅ ЗӨВ: /shipping руу шилжүүлэх
  const checkoutHandler = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/shipping");
    } else {
      navigate("/shipping");
    }
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Таны сагс" />

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <ShoppingBag size={80} strokeWidth={1} />
          </div>
          <h2 className="empty-cart-title">Сагс хоосон байна</h2>
          <p className="empty-cart-message">
            Та одоогоор ямар ч бүтээгдэхүүн нэмээгүй байна
          </p>
          <Link to="/products" className="viewProducts">
            Бүтээгдэхүүн үзэх
          </Link>
        </div>
      ) : (
        <div className="cart-page">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-heading">
              <ShoppingBag size={22} />
              <span>Сагс ({cartItems.length})</span>
            </div>
            <div className="cart-table">
              <div className="cart-table-header">
                <div className="header-product">Бүтээгдэхүүн</div>
                <div className="header-quantity">Тоо</div>
                <div className="header-total">Нийт үнэ</div>
                <div className="header-action">Үйлдэл</div>
              </div>

              {cartItems.map((item) => (
                <CartItem item={item} key={item.product} />
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <h3 className="price-summary-heading">Төлбөрийн дүн</h3>

            <div className="summary-item">
              <p className="summary-label">Дэд нийт :</p>
              <p className="summary-value">
                {subtotal.toLocaleString()}₮
              </p>
            </div>

            <div className="summary-item">
              <p className="summary-label">НӨАТ (10%) :</p>
              <p className="summary-value">{tax.toLocaleString()}₮</p>
            </div>

            <div className="summary-item">
              <p className="summary-label">Хүргэлт :</p>
              <p className="summary-value">
                {shippingCharges === 0
                  ? "Үнэгүй"
                  : `${shippingCharges.toLocaleString()}₮`}
              </p>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <p className="total-label">Нийт :</p>
              <p className="total-value">{total.toLocaleString()}₮</p>
            </div>

            <button className="checkout-btn" onClick={checkoutHandler}>
              Төлбөр төлөх <ArrowRight size={18} />
            </button>

            {/* Trust Badges */}
            <div className="cart-trust">
              <div className="trust-line">
                <Truck size={14} /> 500,000₮-с дээш үнэгүй хүргэлт
              </div>
              <div className="trust-line">
                <Shield size={14} /> 100% аюулгүй төлбөр
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Cart;