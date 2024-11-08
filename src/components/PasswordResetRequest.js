import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/password_reset/', { email });
            setMessage('An email has been sent with instructions to reset your password.');
            setError('');
        } catch (error) {
            setError('Failed to send reset email. Please check the email address.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <div className="password-reset-request">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Send Reset Link</button>
                </form>
                {message && <p>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default PasswordResetRequest;