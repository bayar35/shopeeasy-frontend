import React, { useEffect, useState, useRef } from "react";
import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeErrors,
  removeSuccess,
  updateProfile,
} from "../features/user/userSlice";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "./images/profile.png"
  );
  const toastShownRef = useRef(false);
  const initializedRef = useRef(false);

  const { user, error, success, message, loading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ⭐ Зөвхөн 1 удаа initialize хийх (user ирэхэд)
  useEffect(() => {
    if (user && !initializedRef.current) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar?.url || "./images/profile.png");
      initializedRef.current = true;
    }
  }, [user]);

  const profileImageUpdate = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        // ⭐ ЗУРГИЙГ COMPRESS ХИЙХ (500px, JPEG 0.7)
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 500;
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
          console.log("Original length:", reader.result.length);
          console.log("Compressed length:", compressedBase64.length);
          console.log(
            "Reduction:",
            (
              (1 - compressedBase64.length / reader.result.length) *
              100
            ).toFixed(1) + "%"
          );

          setAvatarPreview(compressedBase64);
          setAvatar(compressedBase64);
        };
        img.onerror = () => {
          toast.error("Зургийг уншихад алдаа гарлаа", {
            position: "top-center",
            autoClose: 3000,
          });
        };
      }
    };
    reader.onerror = () => {
      toast.error("Файл уншихад алдаа гарлаа", {
        position: "top-center",
        autoClose: 3000,
      });
    };
    reader.readAsDataURL(file);
  };

  const updateSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Нэрээ оруулна уу", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!email.trim()) {
      toast.error("И-мэйлээ оруулна уу", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    if (avatar && avatar !== user?.avatar?.url) {
      myForm.set("avatar", avatar);
    }

    dispatch(updateProfile(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success(message || "Профайл амжилттай шинэчлэгдлээ", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      setAvatar("");
      setTimeout(() => {
        toastShownRef.current = false;
        navigate("/profile");
      }, 1500);
    }
  }, [dispatch, success, message, navigate]);

  if (loading && !user) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="form-container">
        <div className="form-content">
          <form
            className="form"
            encType="multipart/form-data"
            onSubmit={updateSubmit}
          >
            <h2>Профайл засах</h2>
            <p className="form-subtitle">Мэдээллээ шинэчлэх</p>

            <div className="input-group avatar-group">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="file-input"
                onChange={profileImageUpdate}
              />
              <img
                src={avatarPreview}
                alt="User Profile"
                className="avatar"
                onError={(e) => {
                  e.target.src = "./images/profile.png";
                }}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Хэрэглэгчийн нэр"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="И-мэйл"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="authBtn"
              disabled={loading}
            >
              {loading ? "Хадгалж байна..." : "Хадгалах"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpdateProfile;