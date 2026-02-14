import React, { useState } from "react";
import Input from "../common/Input.jsx";
import { useSelector, useDispatch } from "react-redux"; 
import axios from "axios";
import validator from "validator";
import "../../css/auth/Login.css";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice.js";
import { clearError, setError, setLoading, setUser } from "../../redux/slices/authSlice.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Fixed variable names: changed forgotPassword/forgotEmail mismatch
    const [forgotEmail, setForgotEmail] = useState(""); 
    const [forgotMsg, setForgotMsg] = useState("");
    
    const dispatch = useDispatch();

    // ✅ FIX: Splitting these prevents the "Selector unknown" error
    const isLoading = useSelector((state) => state.auth.isLoading);
    const error = useSelector((state) => state.auth.error);
    const { authMode } = useSelector((state) => state.ui);

    const isForgot = authMode === "forgot";

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        if (!validator.isEmail(email)) {
            dispatch(setError("Please enter a valid email address."));
            return;
        }
        if (!password) {
            dispatch(setError("Please enter a valid password."));
            return;
        }

        dispatch(setLoading(true));
        try {
           
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            const data = res.data || {};
            
            dispatch(setUser({ user: data.user, token: data.token }));
            // Note: Your setUser slice already handles localStorage, but keeping this is safe
            localStorage.setItem("token", data.token);
            dispatch(closeAuthModal());
        } catch (err) {
            const serverMessage = err?.response?.data?.message || err?.response?.data?.error;
            dispatch(setError(serverMessage || "Login failed. Please try again."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleForgotPassword = async (e) => {
        if (!validator.isEmail(forgotEmail)) {
            setForgotMsg("Please enter a valid email address.");
            return;
        }
        try {
            setForgotMsg("Sending reset link...");
            await axios.post("http://localhost:5000/api/auth/forgot-password", { email: forgotEmail });
            setForgotMsg("If this email is registered, a reset link has been sent.");
        } catch (err) {
            setForgotMsg("Failed to send reset link. Please try again later.");
        }
    };

    return (
        <div className="login-wrapper">
            <h3 className="login-title">Welcome Back</h3>
            <p className="login-subtitle">Enter your credentials to access your account</p>
            <form className="login-form" onSubmit={handleLogin}>
                {!isForgot ? (
                    <>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} label={"Email Address"} placeholder={"Enter your email address"} type={"email"} />
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} label={"Password"} placeholder={"Min 8 characters"} type={"password"} />
                    </>
                ) : (
                    <div className="forgot-box">
                        <Input label="Email" type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                        {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>}
                        <button type="button" className="forgot-submit-btn" onClick={handleForgotPassword}>Send Reset Link</button>
                    </div>
                )}

                <div className="forget-wrapper">
                    {!isForgot ? (
                        <>
                            <span className="forgot-link" onClick={() => {
                                dispatch(clearError());
                                dispatch(switchAuthMode("forgot"));
                            }}>Forgot Password?</span>

                            <span className="forgot-link" onClick={() => {
                                dispatch(clearError());
                                dispatch(switchAuthMode("signup")); // Fixed: Changed from "forgot" to "signup"
                            }}>Don't have an account? Sign up</span>
                        </>
                    ) : (
                        <span className="forgot-link" onClick={() => dispatch(switchAuthMode("login"))}>Back to Login</span>
                    )}
                </div>

                {error && <div className="login-error-msg">{error}</div>}
                
                {!isForgot && (
                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        <span>{isLoading ? "Logging in..." : "Login"}</span>
                    </button>
                )}
            </form>
        </div>
    );
};

export default Login;