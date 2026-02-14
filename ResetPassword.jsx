import React, { use, useState } from 'react';
import axios from 'axios';
import "../../css/auth/resetPassword.css";
import Input from '../common/Input';

const ResetPassword = () => {
    const {token}=useParams();
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleReset = async () => {
        if (!password || password.length < 6) {
            setStatus("error");
            setMessage("Password must be at least 6 characters long.");
            return;
        }
        setLoading(true);
        try {
            setLoading(true);
            setStatus("info");
            setMessage("Resetting password...");
            await axios.post(`http://localhost:5000/api/auth/reset-password`, { token, password });
            setStatus("success");
            setMessage("Password has been reset successfully.");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setStatus("error");
            setMessage(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='reset-wrapper'>
            <h3 className='rest-title'>Reset Password</h3>
            <p className='reset-subtitle'>enter your email to reset your password</p>
            <div className='reset-form'>
                <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                {status=== `error` && <div className='reset-error'>{message}</div>}
                {status=== `success` && <div className='reset-success'>{message}</div>}
                <button className='reset-submit-btn' onClick={handleReset} disabled={loading}>
                    <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                </button>
            </div>
        </div>
    );
};
export default ResetPassword;