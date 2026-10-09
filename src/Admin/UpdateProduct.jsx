import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateProduct.css";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  removeErrors,
  removeSuccess,
  updateProduct,
} from "../features/admin/adminSlice";
import { getProductDetails } from "../features/products/productSlice";
import { toast } from "react-toastify";

function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const { product } = useSelector((state) => state.product);
  const { success, error, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateId } = useParams();

  const categories = [
    "mobile",
    "fruits",
    "laptop",
    "shirt",
    "shoes",
    "pants",
    "glass",
    "watch",
    "cookies",
    "Pomegranate",
    "socks",
    "bag",
    "Electronics",
  ];

  // Fetch product if not loaded or different product
  useEffect(() => {
    if (!product || product._id !== updateId) {
      dispatch(getProductDetails(updateId));
    }
  }, [dispatch, updateId, product]);

  // Fill form when product data arrives
  useEffect(() => {
    if (product && product._id === updateId) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setStock(product.stock || "");
      setOldImage(product.images || []);
    }
  }, [product, updateId]);

  // Handle errors and success
  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Product Updated Successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/admin/products");
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImage([]);
    setImagePreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
          setImage((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const updateProductSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !description || !category || !stock) {
      toast.error("Please fill all the fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    if (image && image.length > 0) {
      image.forEach((img) => {
        myForm.append("image", img);
      });
    }

    dispatch(updateProduct({ id: updateId, formData: myForm }));
  };

  return (
    <>
      <PageTitle title="Update Product" />
            <div className="update-product-container">
        <div className="update-product-form">
          <h1>Update Product</h1>
          <form onSubmit={updateProductSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {oldImage && oldImage.length > 0 && (
              <div className="form-group">
                <label>Current Images</label>
                <div className="old-images">
                  {oldImage.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt="Product"
                      className="old-image"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="image">New Images (optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <div className="new-images">
                {imagePreview &&
                  imagePreview.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt="Preview"
                      className="preview-image"
                    />
                  ))}
              </div>
            </div>

            <button
              type="submit"
              className="update-product-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
          </>
  );
}

export default UpdateProduct;