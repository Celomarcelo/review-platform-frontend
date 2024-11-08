import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordResetConfirm = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await axios.post(`/reset/${uidb64}/${token}/`, { password });
            setMessage('Password has been reset successfully. Redirecting to login...');
            setError('');
            setTimeout(() => navigate('/api/login/'), 3000);
        } catch (error) {
            setError('Failed to reset password. The link may have expired.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="password-reset-confirm">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Confirm New Password:
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default PasswordResetConfirm;