import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/register_style.css';

/**
 * Register Component
 * 
 * This component is responsible for rendering the user registration form,
 * capturing the input data, and sending the data to the server to create a new account.
 */
const Register = () => {
    // State variables for storing form input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    /**
     * Handles form submission.
     * Prevents default form behavior, sends a POST request to the registration API,
     * and navigates the user to the home page on success.
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        // Sends POST request to the server to register a new user
        axios.post('/api/register/', {
            username,
            password,
            email,
        })
            .then(response => {
                // On success, store the authentication token in local storage
                localStorage.setItem('token', response.data.access);
                // Navigate to the home page after successful registration
                navigate('/');
            })
            .catch(error => console.error(error));  // Logs any errors encountered during the request
    };

    return (
        // Renders the registration form and centers it on the screen
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <form className="w-50 p-3" onSubmit={handleSubmit}>
                <div className="w-100 h-100 custom_bg rounded p-4 shadow-lg">
                    <div className="text-center mb-4">
                        <h2 className="fs-1">Create Your Account</h2>
                        <p className="text-muted">Fill in the form below to join our community</p>
                    </div>
                    
                    {/* Username input field */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Username</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Choose a unique username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <small className="form-text text-muted">
                            Your username will be visible to others.
                        </small>
                    </div>

                    {/* Password input field */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Create a secure password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <small className="form-text text-muted">
                            Must be at least 8 characters long.
                        </small>
                    </div>

                    {/* Email input field */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Enter a valid email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <small className="form-text text-muted">
                            We’ll never share your email with anyone else.
                        </small>
                    </div>

                    {/* Submit button */}
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Register
                        </button>
                    </div>

                    <div className="text-center mt-3">
                        <p className="text-muted">Already have an account? <Link className="text-primary" to="/api/login/">login</Link></p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;

