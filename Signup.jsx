import React, { useState } from "react"; // Combined imports
import Input from "../common/Input";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { AiOutlineCamera } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice"; // Fixed import
import { setError, setLoading, setUser, clearError } from "../../redux/slices/authSlice";
import "../../css/auth/Signup.css";

const Signup = () => {
  const dispatch = useDispatch();

  // ✅ FIX: Stable Selectors (Stops the Redux Warning)
  const {isLoading, error} = useSelector((state) => state.auth);
 

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
 reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
    
  };

  // ✅ FIX: Moved handleSignup OUTSIDE of handleImageChange
  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!fullname || !email || !password) {
      dispatch(setError("Please fill in all required fields."));
      return;
    }
    
    dispatch(setLoading(true));
    try {
       
      const res = await axios.post("http://localhost:5000/api/auth/signup",{name: fullname, email, password, /*avatar: base64Image*/});
      const data = res.data || {};
      
      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("Signup successful");
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.response?.data?.error;
      dispatch(setError(serverMessage || "Signup failed. Please try again."));
    } finally {
        dispatch(setLoading(false));
    }
  };

  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an Account</h3>
      <p className="signup-subtitle">Join us today! It takes only a few steps.</p>
      
      {/* ✅ FIX: Added onSubmit handler to the form */}
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="profile-image-container">
          {previewImage ? (
            <img src={previewImage} alt="avatar" className="profile-image-preview" />
          ) : (
            <div className="profile-image-placeholder">
              <CiUser size={40} />
            </div>
          )}
          <label className="image-upload-icon">
            <AiOutlineCamera size={20} />
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
        </div>

        <Input label={"Name"} type={"text"} placeholder={"Enter your name"} value={fullname} onChange={(e) => setFullname(e.target.value)} />
        <Input label={"Email Address"} type={"email"} placeholder={"Enter your email address"} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label={"Password"} type={"password"} placeholder={"Min 8 characters"} value={password} onChange={(e) => setPassword(e.target.value)} />

        <span className="forgot-link" onClick={() => {
          dispatch(clearError());
          dispatch(switchAuthMode("login")); // Fixed: switchAuthMode
        }}>
          Do you already have an account? Login
        </span>

        {error && <div className="signup-error-msg">{error}</div>}

        <div className="signup-actions">
          <button className="signup-btn-submit" disabled={isLoading} type="submit">
            <span>{isLoading ? "Signing Up..." : "Sign Up"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;