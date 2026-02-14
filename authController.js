import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config(); 
import imagekit from "../config/imagekit.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
const createToken=(userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
const signup = async (req, res) => {
    try {
        const  { name, email, password, avatar } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne ({ email });
        if (existingUser) {
            return res.status(400).json({ message: "EmailId already exists" });
        }
        let avatarUrl = "";
        if (avatar) {
            const uploadResponse = await imagekit.upload({
                file: avatar,
                fileName: `avatar_${Date.now()}.jpg`,
                folder: "/avatars/",
            });
            avatarUrl = uploadResponse.url;
        }
        const user=await User.create({ name, email, password, avatar: avatarUrl });
        const token=createToken(user._id);
        res.status(201).json({ message: "User created successfully", user: {
id: user._id, name: user.name, email: user.email, avatar: user.avatar
        } , token });
    }catch (error) {
    console.error("Signup not successful:", error.message);
    console.error(error); // optional but helpful
    res.status(500).json({ message: error.message || "Signup error" });
}

    
};
const login= async (req, res) => {
    try{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email : email});
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch= await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token=createToken(user._id);
    res.status(200).json({ message: "Login successful", user: {
        id: user._id, name: user.name, email: user.email ,
    }, token });
}catch (error) {
    console.error("Login not successfull" );
    res.status(500).json({ message: "Login error" });
}
};

//protected controller
const getMe= async (req,res)=>{
    if(!req.user){
        return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    res.status(200).json({
    user: {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  }
});

};

const forgotPassword= async (req,res)=>{
    try{
        const {email}= req.body;
        if(!email){
            return res.status(400).json({ message: "Email is required" });
        }
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        const resetToken= crypto.randomBytes(32).toString("hex");
        const hashedToken= crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken= hashedToken;
        user.resetPasswordTokenExpires= Date.now() + 10 * 60 * 1000; //10 minutes
        await user.save();
        const resetUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        //send email
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested for password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 10 minutes.</p>`
        });
        res.status(200).json({ message: "Password reset email sent" });
}catch(error){
    console.error("Forgot Password error: ", error.message);
    res.status(500).json({ message: "Forgot Password error" });
}
};
const resetPassword= async (req,res)=>{
   try {
    const { token }= req.params;
    const { password }= req.body;
    if(!password ||password.length<6){
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const hashedToken= crypto.createHash("sha256").update(token).digest("hex");
    const user= await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: { $gt: Date.now() }
    });
    if(!user){
        return res.status(400).json({ message: "Invalid or expired password reset token" });
    }
    user.password= password;
    user.resetPasswordToken= undefined;
    user.resetPasswordTokenExpires= undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
   } catch (error) {
    console.error("Reset Password error: ", error.message);
    res.status(500).json({ message: "Reset Password error" });
   }
};
const editProfile= async (req,res)=>{
    try{
        const userId= req.user._id;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        const { name, email, avatar, currentPassword, newPassword }= req.body;
        const user= await User.findById(userId);
        if (name) user.name= name;
        console.log(user);
        if (email) user.email= email;
        if (currentPassword || newPassword) {
            if(!currentPassword || !newPassword){
                return res.status(400).json({ message: "Both current and new passwords are required to change password" });
            }
            const isMatch= await user.comparePassword(currentPassword);
            if(!isMatch){
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (newPassword.length<6){
                return res.status(400).json({ message: "New password must be at least 6 characters long" });
            }
            user.password= newPassword;
        }
        if (avatar) {
            const uploadResponse = await imagekit.upload({
                file: avatar,
                fileName: `avatar_${userId}_${Date.now()}.jpg`,
                folder: "/musicApp/avatars/",
            });
            user.avatar= uploadResponse.url;
        }
        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user: {
            id: user._id, name: user.name, email: user.email, avatar: user.avatar
        } });
    }catch (error) {
        console.error("Edit Profile error: ", error.message);
        res.status(500).json({ message: "Edit Profile error" });
    }
};
export{signup, login, getMe, forgotPassword, resetPassword, editProfile};