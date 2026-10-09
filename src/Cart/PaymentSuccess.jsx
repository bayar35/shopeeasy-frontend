import React, { useEffect } from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { removeErrors, removeSuccess, createOrder } from "../features/order/orderSlice";
import {
  removeErrors,
  removeSuccess,
  createOrder,
} from "../features/order/orderSlice";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { loading, success, error } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    const createOrderData = async () => {
      try {
        const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
        if (!orderItem) return;
        const orderData = {
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pinCode,
            phoneNo: shippingInfo.phoneNumber,
          },
          orderItems: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: "succeeded",
          },
          itemPrice: orderItem.subtotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shippingCharges,
          totalPrice: orderItem.total,
        };
        dispatch(createOrder(orderData));
        sessionStorage.removeItem("orderItem");
      } catch (error) {
        (toast.error(error.message || "Order Creation Error"),
          { position: "top-center", autoClose: 3000 });
      }
    };
    createOrderData();
  }, []);

  useEffect(() => {
    if (success) {
      toast.success("Order Placed", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(createOrder());
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Payment Status" />
          <Navbar />
          <div className="payment-success-container">
            <div className="success-content">
              <div className="success-icon">
                <div className="checkmark"></div>
              </div>
              <h1>Order Confirmed</h1>
              <p>
                Your payment was successful. Reference ID{" "}
                <strong>{reference}</strong>
              </p>
              <Link className="explore-btn" to="/orders/user">
                View Orders
              </Link>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default PaymentSuccess;
