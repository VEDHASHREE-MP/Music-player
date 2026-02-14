import React , {useEffect}from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useDispatch} from "react-redux";
import Homepage from "./pages/Homepage";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import axios from "axios";
 
import { useSelector } from "react-redux";
import { setLoading, setUser, clearError, logout } from "./redux/slices/authSlice.js";
import "./App.css";
 import Login from "./components/auth/Login.jsx";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

import Signup from "./components/auth/Signup.jsx";
import { setError } from "./redux/slices/authSlice.js";

function App() {
  const dispatch=useDispatch();
  const {token, user}=useSelector((state)=>state.auth);
  useEffect(()=>{
    const storedToken= token || localStorage.getItem("token");
    if (!storedToken || user) return;
    const fetchUserData= async()=>{
      try{
        dispatch(setLoading(true));
        dispatch(clearError());
        const res=await  axios.get(`http://localhost:5000/api/auth/me`,
          {
            headers:{
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        const data= await res.data;
        dispatch(setUser({user: data.user, token: storedToken}));
      }catch(error){
         console.error("getMe failed:", error);
         dispatch(logout());
         dispatch(setError(error ?.response ?. data ?. message || "Failed to fetch user data"));
      }finally{
        dispatch(setLoading(false));
      }
    };
    fetchUserData();

   },[dispatch, token, user]);
  return (
    <BrowserRouter>
      

<Routes>
  <Route path="/" element={<Homepage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
</Routes>

    </BrowserRouter>
  );
}

export default App;
