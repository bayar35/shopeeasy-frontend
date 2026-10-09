import React, { useEffect } from "react";
import "../WishlistStyles/Wishlist.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import Product from "../components/Product";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeErrors } from "../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

function Wishlist() {
  const { products, loading, error } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <PageTitle title="Хүслийн жагсаалт" />
      <Navbar />

      {loading ? (
        <Loader />
      ) : products && products.length > 0 ? (
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1>
              <Heart size={32} fill="#ff6b35" color="#ff6b35" /> Хүслийн жагсаалт
            </h1>
            <p>{products.length} бүтээгдэхүүн</p>
          </div>

          <div className="wishlist-grid">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-wishlist">
          <Heart size={80} strokeWidth={1} />
          <h2>Хүслийн жагсаалт хоосон байна</h2>
          <p>Та дуртай бүтээгдэхүүнээ ♡ товчоор хадгалаарай</p>
          <Link to="/products" className="browse-products-btn">
            Бүтээгдэхүүн үзэх
          </Link>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Wishlist;