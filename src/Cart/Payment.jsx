import React, { useEffect, useState } from "react";
import "../CartStyles/Payment.css";
import CheckoutPath from "./CheckoutPath";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import { ArrowLeft, CreditCard } from "lucide-react";

function Payment() {
  const [orderItem, setOrderItem] = useState(null);
  const [processing, setProcessing] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. OrderItem шалгах
    try {
      const stored = sessionStorage.getItem("orderItem");
      if (stored) {
        setOrderItem(JSON.parse(stored));
      } else {
        toast.error("Захиалгын мэдээлэл олдсонгүй. Сагс руу буцаана уу.", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/cart");
        return;
      }
    } catch (error) {
      console.error("Failed to parse orderItem:", error);
      navigate("/cart");
      return;
    }

    // 2. ShippingInfo шалгах (localStorage-с ч, Redux-с ч)
    const shippingFromStorage = JSON.parse(
      localStorage.getItem("shippingInfo") || "{}"
    );
    const finalShipping = shippingInfo?.address
      ? shippingInfo
      : shippingFromStorage;

    if (!finalShipping || !finalShipping.address) {
      toast.error(
        "Хүргэлтийн мэдээлэл дутуу. Shipping хуудас руу буцаана уу.",
        { position: "top-center", autoClose: 3000 }
      );
      navigate("/shipping");
      return;
    }
  }, [navigate, shippingInfo]);

  const completePayment = async () => {
    if (!orderItem) return;

    // ✨ ShippingInfo-г Redux-с эсвэл localStorage-с авах
    const shippingFromStorage = JSON.parse(
      localStorage.getItem("shippingInfo") || "{}"
    );
    const finalShipping = shippingInfo?.address
      ? shippingInfo
      : shippingFromStorage;

    // ✨ Хамгаалалт
    if (!finalShipping || !finalShipping.address) {
      toast.error(
        "Хүргэлтийн мэдээлэл дутуу. Shipping хуудас руу буцаана уу.",
        { position: "top-center", autoClose: 3000 }
      );
      navigate("/shipping");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Сагс хоосон байна.", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/cart");
      return;
    }

    setProcessing(true);
    try {
      const orderData = {
        shippingInfo: {
          address: finalShipping.address,
          city: finalShipping.district || finalShipping.city || "",
          state: finalShipping.province || finalShipping.state || "",
          country: finalShipping.country || "MN",
          pinCode: Number(finalShipping.pincode),
          phoneNo: Number(finalShipping.phoneNumber),
        },
        orderItems: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item.product,
        })),
        // ✨ paymentInfo-г ТОДОРХОЙ болгох
        paymentInfo: {
          id: "COD_" + Date.now(),
          status: "Cash on Delivery",
        },
        itemPrice: orderItem.subtotal,
        taxPrice: orderItem.tax,
        shippingPrice: orderItem.shippingCharges,
        totalPrice: orderItem.total,
      };

      console.log("=== Order Data ===");
      console.log("shippingInfo:", orderData.shippingInfo);
      console.log("paymentInfo:", orderData.paymentInfo);
      console.log("orderItems:", orderData.orderItems);

      const { data } = await axios.post("/api/v1/new/order", orderData);

      if (data.success) {
        dispatch(clearCart());
        sessionStorage.removeItem("orderItem");

        toast.success("Захиалга амжилттай үүслээ! 🎉", {
          position: "top-center",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate(`/paymentSuccess?orderId=${data.order._id}`);
        }, 500);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Захиалга үүсгэхэд алдаа гарлаа",
        { position: "top-center", autoClose: 5000 }
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!orderItem) {
    return (
      <>
        <PageTitle title="Төлбөр төлөх" />
        <Navbar />
        <CheckoutPath activePath={2} />
        <div className="payment-container">
          <p>Уншиж байна...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Төлбөр төлөх" />
      <Navbar />
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to="/order/confirm" className="payment-go-back">
          <ArrowLeft size={18} />
          Буцах
        </Link>

        <div className="payment-summary-card">
          <h3>Захиалгын дүн</h3>
          <div className="summary-row">
            <span>Дэд нийт</span>
            <span>{orderItem.subtotal.toLocaleString()}₮</span>
          </div>
          <div className="summary-row">
            <span>НӨАТ (10%)</span>
            <span>{orderItem.tax.toLocaleString()}₮</span>
          </div>
          <div className="summary-row">
            <span>Хүргэлт</span>
            <span>{orderItem.shippingCharges.toLocaleString()}₮</span>
          </div>
          <div className="summary-row total">
            <span>Нийт</span>
            <strong>{orderItem.total.toLocaleString()}₮</strong>
          </div>
        </div>

        <button
          className="payment-btn"
          onClick={completePayment}
          disabled={processing}
        >
          <CreditCard size={20} />
          {processing
            ? "Боловсруулж байна..."
            : `Төлөх (${orderItem.total.toLocaleString()}₮)`}
        </button>
      </div>
      <Footer />
    </>
  );
}

export default Payment;