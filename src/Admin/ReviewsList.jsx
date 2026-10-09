import React, { useEffect, useState } from "react";
import "../AdminStyles/ReviewsList.css";
import PageTitle from "../components/PageTitle";
import { Delete } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteReview,
  fetchAdminProducts,
  fetchProductReviews,
  removeErrors,
  removeSuccess,
  clearMessage,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function ReviewsList() {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleViewReviews = async (productId) => {
    setSelectedProduct(productId);
    setLoadingReviews(true);
    await dispatch(fetchProductReviews(productId));
    setLoadingReviews(false);
  };

  const handleDeleteReview = (productId, reviewId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirm) {
      dispatch(deleteReview({ productId, reviewId })).then(() => {
        dispatch(fetchProductReviews(productId));
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(clearMessage());
    }
  }, [dispatch, error, success, message]);

  return (
    <>
      <PageTitle title="All Reviews" />
      <div className="reviews-list-container">
        <h1 className="reviews-list-title">All Products</h1>

        {/* Зөвхөн эхний ачаалалтад Loader */}
        {loading && !products ? (
          <Loader />
        ) : !products || products.length === 0 ? (
          <p style={{ textAlign: "center", padding: "30px" }}>
            No Products Found
          </p>
        ) : (
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Product Name</th>
                <th>Product Image</th>
                <th>Number of Reviews</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0].url
                          : "https://via.placeholder.com/50"
                      }
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.numOfReviews || 0}</td>
                  <td>
                    {product.numOfReviews > 0 && (
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewReviews(product._id)}
                      >
                        View Reviews
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Review-үүд */}
        {selectedProduct && (
          <div className="reviews-details">
            {loadingReviews ? (
              <Loader />
            ) : reviews && reviews.length > 0 ? (
              <>
                <h2>Reviews for Product</h2>
                <table className="reviews-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Reviewer Name</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={review._id}>
                        <td>{index + 1}</td>
                        <td>{review.name}</td>
                        <td>{review.rating}</td>
                        <td>{review.comment}</td>
                        <td>
                          <button
                            className="action-btn delete-btn"
                            onClick={() =>
                              handleDeleteReview(selectedProduct, review._id)
                            }
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p style={{ textAlign: "center", padding: "20px" }}>
                No reviews found for this product
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ReviewsList;