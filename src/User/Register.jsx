import React, { useEffect, useState, useRef } from "react";
import "../UserStyles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../features/user/userSlice";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");
  const toastShownRef = useRef(false);

  const { name, email, password } = user;
  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
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
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerSubmit = (e) => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Зөв и-мэйл хаяг оруулна уу", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!password) {
      toast.error("Нууц үгээ оруулна уу", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!avatar) {
      toast.error("Профайл зураг сонгоно уу", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("email", email);
    myForm.append("password", password);
    myForm.append("avatar", avatar);

    dispatch(register(myForm));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleLogin(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    toast.error("Google-ээр нэвтрэх боломжгүй", {
      position: "top-center",
      autoClose: 3000,
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
  }, [dispatch, error]);

  useEffect(() => {
    if (success && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success("Бүртгэл амжилттай! Нэвтэрнэ үү.", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      setTimeout(() => {
        toastShownRef.current = false;
      }, 1500);
      navigate("/login");
    }
  }, [dispatch, success, navigate]);

  return (
    <div className="form-container">
      <div className="form-content">
        <form
          className="form"
          onSubmit={registerSubmit}
          encType="multipart/form-data"
        >
          <h2>Бүртгүүлэх</h2>
          <p className="form-subtitle">Шинэ бүртгэл үүсгэх</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="Хэрэглэгчийн нэр"
              name="name"
              value={name}
              onChange={registerDataChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="И-мэйл"
              name="email"
              value={email}
              onChange={registerDataChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Нууц үг"
              name="password"
              value={password}
              onChange={registerDataChange}
              required
            />
          </div>

          <div className="input-group avatar-group">
            <input
              type="file"
              name="avatar"
              className="file-input"
              accept="image/*"
              onChange={registerDataChange}
            />
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="avatar"
              onError={(e) => {
                e.target.src = "./images/profile.png";
              }}
            />
          </div>

          <button type="submit" className="authBtn" disabled={loading}>
            {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
          </button>

          <div className="form-divider">эсвэл</div>

          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="360"
            />
          </div>

          <p className="form-links">
            Бүртгэл байна уу?
            <Link to="/login">Нэвтрэх</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;