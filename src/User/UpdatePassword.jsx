import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeErrors } from "../features/products/productSlice";
import { toast } from "react-toastify";
import { removeSuccess } from "../features/user/userSlice";

function updatePassword() {
  const {success, loading, error}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    for(let pair of myForm.entries()) {
      console.log(pair[0]+'-'+pair[a])
    }
    dispatch(updatePassword(myForm))
  };

  useEffect(() => {
      if (error) {
        toast.error(error.message, { position: "top-center", autoClose: 3000 });
        dispatch(removeErrors());
      }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
          toast.success("Password Update successfully", { position: "top-center", autoClose: 3000 });
          dispatch(removeSuccess());
          navigate("/profile");
        }
      }, [dispatch, success]);

  return (
    <>

    {loading?(<Loader />): (
      <>
      <Navbar />
      <PageTitle title="Password Update" />
      <div className="container update-container">
        <div className="form-content">
          <form className="form" onSubmit={updatePasswordSubmit}>
            <h2>Update Password</h2>

            <div className="input-group">
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="newPassword"
                placeholder="New Password" value={newPassword} onChange={(e)=>setOldPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
              />
              <button className="authBtn">Update Password</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>)}
    </>
  );
}

export default updatePassword;
