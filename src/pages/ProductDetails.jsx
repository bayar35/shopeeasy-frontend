import React, { useEffect, useState } from "react";
import "../pageStyles/ProductDetails.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProductDetails,
  createReview,
  removeErrors,
  removeSuccess,
} from "../features/products/productSlice";
import { addItemsToCart, removeMessage } from "../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  optimisticAdd,
  optimisticRemove,
} from "../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { ShoppingBag } from "lucide-react";

function ProductDetails() {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const { loading, error, product, reviewSuccess, reviewLoading } = useSelector(
    (state) => state.product
  );
  const {
    loading: cartLoading,
    error: cartError,
    success,
    message,
  } = useSelector((state) => state.cart);

  const { products: wishlistProducts } = useSelector(
    (state) => state.wishlist
  );
  const isInWishlist = wishlistProducts?.some(
    (item) => item._id === product?._id
  );

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
    dispatch(getWishlist());
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
    if (cartError) {
      toast.error(cartError, { position: "top-center", autoClose: 3000 });
    }
  }, [dispatch, error, cartError]);

  useEffect(() => {
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Сэтгэгдэл амжилттай илгээгдлээ", {
        position: "top-center",
        autoClose: 3000,
      });
      setUserRating(0);
      setComment("");
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    }
  }, [reviewSuccess, id, dispatch]);

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Тоо 1-с багагүй байх ёстой", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setQuantity((qty) => qty - 1);
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error("Нөөц хэтрэхгүй байх ёстой!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setQuantity((qty) => qty + 1);
  };

  const addToCart = () => {
    dispatch(addItemsToCart({ id, quantity }));
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(optimisticRemove(product._id));
      dispatch(removeFromWishlist(product._id));
      toast.success("Хүслийн жагсаалтаас устгагдлаа", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      dispatch(optimisticAdd(product));
      dispatch(addToWishlist(product));
      toast.success("Хүслийн жагсаалтад нэмэгдлээ", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userRating) {
      toast.error("Үнэлгээ сонгоно уу", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(
      createReview({
        rating: userRating,
        comment,
        productId: id,
      })
    );
  };

  if (loading) {
    return (
      <>
        <PageTitle title="Уншиж байна..." />
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageTitle title="Бүтээгдэхүүн" />
        <Navbar />
        <div className="product-details-container">
          <p style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>
            Бүтээгдэхүүн олдсонгүй
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title={`${product.name} - Дэлгэрэнгүй`} />
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="product-detail-image"
              />
            ) : (
              <div className="product-detail-image-placeholder">
                <ShoppingBag size={80} />
              </div>
            )}
            {product.images && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail-image"
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">
              Үнэ :{" "}
              <span className="price">{product.price.toLocaleString()}₮</span>
            </p>

            <div className="product-rating">
              <Rating value={product.ratings || 0} disabled={true} />
              <span className="productCardSpan">
                ( {product.numOfReviews}{" "}
                {product.numOfReviews === 1 ? "Сэтгэгдэл" : "Сэтгэгдэл"} )
              </span>
            </div>

            <div className="stock-status">
              <span
                className={product.stock > 0 ? "in-stock" : "out-of-stock"}
              >
                {product.stock > 0
                  ? `Нөөцөд байгаа (${product.stock} боломжтой)`
                  : "Нөөц дууссан"}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="quantity-control">
                  <span className="quantity-label">Тоо ширхэг: </span>
                  <button
                    className="quantity-button"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    className="quantity-value"
                    readOnly
                  />
                  <button
                    className="quantity-button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>

                {/* Action buttons: Add to Cart + Wishlist */}
                <div className="action-buttons-row">
                  <button
                    className="add-to-cart-btn"
                    onClick={addToCart}
                    disabled={cartLoading}
                  >
                    <ShoppingBag size={20} />
                    {cartLoading ? "Нэмж байна..." : "Сагслах"}
                  </button>

                  <button
                    className={`wishlist-btn-detail ${
                      isInWishlist ? "active" : ""
                    }`}
                    onClick={handleWishlist}
                    aria-label="Add to wishlist"
                  >
                    {isInWishlist ? "❤" : "♡"}
                  </button>
                </div>
              </>
            )}

            <form className="form-rev" onSubmit={handleReviewSubmit}>
              <h3>Сэтгэгдэл бичих</h3>
              <Rating
                value={userRating}
                disabled={false}
                onRatingChange={handleRatingChange}
              />
              <textarea
                placeholder="Сэтгэгдлээ энд бичнэ үү..."
                className="review-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button
                className="submit-review-btn"
                disabled={reviewLoading}
              >
                {reviewLoading ? "Илгээж байна..." : "Сэтгэгдэл илгээх"}
              </button>
            </form>
          </div>
        </div>

        <div className="reviews-container">
          <h3>Хэрэглэгчийн сэтгэгдэл</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-section">
              {product.reviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="review-header">
                    <Rating value={review.rating} disabled={true} />
                  </div>
                  <div className="review-comment">{review.comment}</div>
                  <div className="review-name">Бичсэн : {review.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">
              Одоогоор сэтгэгдэл байхгүй. Та анхны сэтгэгдэл бичигч болоорой!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;