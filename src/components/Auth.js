import { jwtDecode } from 'jwt-decode';

/** Function to check the validity of the JWT token stored in localStorage. */

export const isTokenValid = () => {
    const token = localStorage.getItem('token');  // Retrieve the token stored in localStorage
    if (!token) return false;  // Return 'false' if the token does not exist

    try {
        // Decode the token to extract information
        const decodedToken = jwtDecode(token);
        
        const currentTime = Date.now() / 1000;  // Get the current time in seconds
        // Check if the token has expired by comparing the expiration time with the current time
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');  // Remove the expired token from localStorage
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');  // Remove the corrupted or invalid token from localStorage
        return false;
    }
};
