import React, { useState } from "react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6";
import "../../css/auth/Input.css";
const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="input-wrapper"> 
      <label >{label}</label>
      <div className="input-container"> 
      <input type={type == "password" ? (showPassword ? "text" : "password") : type} placeholder={placeholder} value={value} onChange={(e) => onChange(e)} className="input-field" />
        {type === "password" && (
          <button type="button" className="password-toggle">
            {showPassword ? (<FaRegEye size={22} onClick={()=> togglePasswordVisibility()}/>) : (<FaRegEye size={22} onClick={()=> togglePasswordVisibility()}/>)}
          </button>
        )}
        </div>
    </div>
    );
};

export default Input;