import React, { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function CreateProduct() {
  const { success, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const categories = [
    "Electronics",
    "FRUITS",
    "Fashion",
    "Home",
    "Sports",
    "Books",
    "Toys",
    "glass",
    "shirt",
    "mobile",
    "dress",
    "tv",
  ];

  const createProductSubmit = (e) => {
    e.preventDefault();

    console.log("=== SUBMIT DEBUG ===");
    console.log("image state:", image);
    console.log("image.length:", image.length);

    if (!name || !price || !description || !category || !stock) {
      toast.error("Please fill all the fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!image || image.length === 0) {
      console.log("❌ Validation FAILED: image is empty");
      toast.error("Please upload product images", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    console.log("✅ Validation PASSED");

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    // Base64 -> File хөрвүүлэх
    image.forEach((base64Img, index) => {
      const byteString = atob(base64Img.split(",")[1]);
      const mimeString = base64Img.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `product_${index}.jpg`, {
        type: mimeString,
      });

      myForm.append("images", file);
    });

    console.log("=== FORMDATA DEBUG ===");
    for (let pair of myForm.entries()) {
      console.log(pair[0], pair[1]);
    }

    dispatch(createProduct(myForm));
  };

  const createProductImage = (e) => {
    const files = Array.from(e.target.files);

    setImage([]);
    setImagePreview([]);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Зөвхөн зураг файл сонгоно уу", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Зургийн хэмжээ 5MB-с бага байх ёстой", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_SIZE = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

            console.log("=== IMAGE COMPRESSION ===");
            console.log("Original:", reader.result.length);
            console.log("Compressed:", compressedBase64.length);

            setImagePreview((old) => [...old, compressedBase64]);
            setImage((old) => {
              console.log("New image array length:", old.length + 1);
              return [...old, compressedBase64];
            });
          };
        }
      };
      reader.readAsDataURL(file);
    });
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
      toast.success("Product Created Successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setImage([]);
      setImagePreview([]);
    }
  }, [dispatch, error, success]);

  return (
    <>
      <PageTitle title="Create Product" />
      <div className="create-product-container">
        <h1 className="form-title">Create Product</h1>
        <form
          className="product-form"
          encType="multipart/form-data"
          onSubmit={createProductSubmit}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Enter Product Name"
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Price"
            required
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Enter Product Description"
            required
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            name="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a Category</option>
            {categories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Stock"
            required
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              className="form-input-file"
              multiple
              name="images"
              onChange={createProductImage}
            />
          </div>
          <div className="file-preview-container">
            {imagePreview.map((img, index) => (
              <img
                src={img}
                alt="Product Preview"
                className="image-preview"
                key={index}
              />
            ))}
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? "Creating Product..." : "Create"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateProduct;