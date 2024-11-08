import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { isTokenValid } from './Auth';
import '../assets/css/Favorites_style.css';

/**
 * FavoritesList Component
 * 
 * This component displays a grid of the user's favorite profiles. Each favorite is displayed
 * as a clickable profile image, linking to the user's list of reviews.
 *
 */ 

const FavoritesList = () => {
  // State to store list of favorite users
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);  // State for error messages
  const [loading, setLoading] = useState(true);  // State to track loading status
  const navigate = useNavigate();

  // useEffect to fetch favorites data and handle authentication check
  useEffect(() => {
    // Check if the token is valid; if not, redirect to login page
    if (!isTokenValid()) {
      navigate('/api/login/');
      return;
    }

    // Async function to fetch favorite users data
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');

        // API call to get user's favorites
        const response = await axios.get('/user/favorites/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        // Update state with retrieved favorites data
        setFavorites(response.data);
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to load favorites.');  // Set error message if fetching fails
        setLoading(false);  // End loading state
      }
    };

    fetchFavorites();
  }, [navigate]);

  // Display loading message while data is being fetched
  if (loading) {
    return <div>Loading favorites...</div>;
  }

  // Display error message if there was an error during data fetching
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="border border-secondary rounded p-3 text-center bk-color">
      <h2>Favorites</h2>
      {/* If there are favorites, display them in a grid; otherwise, show a message */}
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((user) => (
            // Link each favorite user to their review list page
            <Link key={user.id} to={`/user/${user.id}/reviewsList`} className="favorite-item">
              <img
                src={user.profile_image}
                alt={user.username}
                className="profile-image"
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p>You have no favorite users.</p>
      )}
    </div>
  );
};

export default FavoritesList;

