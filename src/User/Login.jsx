import React, { useEffect, useState, useRef } from "react";
import "../UserStyles/Form.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  googleLogin,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const toastShownRef = useRef(false);
  const googleToastShownRef = useRef(false);

  const { error, loading, success, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const loginSubmit = (e) => {
    e.preventDefault();
    toastShownRef.current = false;
    dispatch(login({ email: loginEmail, password: loginPassword }));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    googleToastShownRef.current = false;
    dispatch(googleLogin(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    toast.error("Google login failed", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  // Error useEffect
  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  // Success toast — useRef ашиглаж 2 удаа гарахаас сэргийлэх
  useEffect(() => {
    if (success && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success("Амжилттай нэвтэрлээ", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      setTimeout(() => {
        toastShownRef.current = false;
      }, 1500);
    }
  }, [dispatch, success]);

  return (
    <div className="form-container">
      <div className="form-content">
        <form className="form" onSubmit={loginSubmit}>
          <h2>Нэвтрэх</h2>
          <p className="form-subtitle">Бүртгэлдээ нэвтэрнэ үү</p>

          <div className="input-group">
            <input
              type="email"
              placeholder="И-мэйл"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Нууц үг"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>

          <button className="authBtn" disabled={loading} type="submit">
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>

          <div className="form-divider">эсвэл</div>

          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="360"
            />
          </div>

          <p className="form-links">
            Нууц үг мартсан уу?
            <Link to="/password/forgot">Сэргээх</Link>
          </p>
          <p className="form-links">
            Бүртгэл байхгүй юу?
            <Link to="/register">Бүртгүүлэх</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;