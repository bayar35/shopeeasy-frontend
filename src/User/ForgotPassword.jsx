import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";
import { toast } from "react-toastify";

function ForgotPassword() {
  const { loading, error, success, message } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const forgotPasswordEmail = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
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
    if (success) {
      toast.success(message || "И-мэйл амжилттай илгээгдлээ", {
        position: "top-center",
        autoClose: 3000,
      });
      setEmail("");
      dispatch(removeSuccess());
    }
  }, [dispatch, success, message]);

  return (
    <>
      <PageTitle title="Нууц үг сэргээх" />
      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <div className="forgot-container">
          <div className="email-group">
            <form className="form" onSubmit={forgotPasswordEmail}>
              <div className="form-content">
                <h2>Нууц үг сэргээх</h2>
                <p className="form-subtitle">
                  И-мэйл хаягаа оруулна уу. Бид танд нууц үг сэргээх линк
                  илгээнэ.
                </p>

                <div className="input-group">
                  <input
                    type="email"
                    placeholder="И-мэйл хаяг"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button className="authBtn" disabled={loading}>
                  {loading ? "Илгээж байна..." : "Илгээх"}
                </button>

                <p className="form-links">
                  <Link to="/login">← Нэвтрэх хуудас руу буцах</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ForgotPassword;