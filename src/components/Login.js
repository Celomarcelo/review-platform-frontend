import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../assets/css/login_style.css';

/**
 * Login Component
 * 
 * This component handles the login process for users. It captures the user's
 * username and password, sends the login request to the server, and processes
 * the response. If successful, it stores the authentication token and redirects 
 * the user to the homepage. It also provides a link for users to register if 
 * they do not have an account.
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [passwordError, setError] = useState(null);

    /**
     * checkBackendData
     * 
     * This function prints a confirmation message to the console when backend data is received.
     */
    const checkBackendData = () => {
        console.log("Dados recebidos do backend com sucesso!");
    };

    /**
     * checkBackendDataFailure
     * 
     * This function prints an error message to the console if backend data is not received.
     */
    const checkBackendDataFailure = () => {
        console.log("Falha ao receber dados do backend. Verifique as credenciais ou a conexão.");
    };

    /**
     * handleSubmit
     * 
     * This function is triggered when the login form is submitted. It prevents the
     * default form submission behavior, sends a POST request to the server with 
     * the username and password, and handles the server response.
     */
    const handleSubmit = (event) => {
        event.preventDefault();  // Prevents default form submission

        // Send POST request to the login endpoint
        axios.post('${process.env.REACT_APP_API_URL}/api/login/', {
            username,  // Send username from the form input
            password,  // Send password from the form input
        })
            .then(response => {
                // Check if data was received from the backend
                checkBackendData();
                console.log("Token recebido:", response.data.access);
                console.log("Resposta do backend:", response.data);

                // Store the authentication token in localStorage
                localStorage.setItem('token', response.data.access);

                // Check if the user object exists before accessing it
                if (response.data.user && response.data.user.id) {
                    localStorage.setItem('userId', response.data.user.id);
                } else {
                    console.warn("A resposta do backend não contém o objeto 'user' ou o 'id' do usuário.");
                }

                // Redirect the user to the homepage after successful login
                navigate('/');
            })
            .catch(error => {
                // Handle login failure by displaying an error message
                checkBackendDataFailure();
                console.error("Login Error:", error);
                setError('Enter with a valid ID or password.');
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            {/* Left section with branding */}
            <div className="text-center" style={{ marginRight: '150px' }}>
                <h1>Books&Films</h1>
                <p>Share ideas about books and films!</p>
            </div>

            {/* Login form */}
            <form className="p-3" onSubmit={handleSubmit}>
                <div className="w-100 custom_bg rounded p-4">
                    {/* Header section with title */}
                    <div className="text-center mb-4">
                        <h2 className="fs-1">Login</h2>

                        {/* Display error message if login fails */}
                        {passwordError && (
                            <div className="alert alert-danger mt-3 text-center">
                                {passwordError}
                            </div>
                        )}
                    </div>

                    {/* Username input field */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Password input field */}
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Submit button */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Login
                        </button>
                    </div>

                    {/* Registration link for users without an account */}
                    <div className="text-center m-4">
                        <p>
                            Don't have an account yet? You can register
                            <Link className="text-primary" to="/register"> here</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;