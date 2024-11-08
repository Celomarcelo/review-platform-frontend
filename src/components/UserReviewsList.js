import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { isTokenValid } from './Auth';

/**
 * UserReviewsList Component
 * 
 * This component displays a list of reviews for a specific user. It also provides functionality 
 * for users to favorite/not favorite the profile they are viewing, and shows details about the user.
 * 
 */

const UserReviewsList = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');  // Retrieve authentication token

    useEffect(() => {
        // Redirect to login if the token is invalid
        if (!isTokenValid()) {
            navigate('/api/login/');
            return;
        }
        const fetchUserData = async () => {
            try {
                // Fetch user profile data
                const userResponse = await axios.get(`/user/${userId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userResponse.data);

                // Fetch reviews created by the user
                const reviewsResponse = await axios.get(`/user/${userId}/reviews/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(reviewsResponse.data);

                // Fetch current user's favorites list to check if this user is already a favorite
                const favoritesResponse = await axios.get(`/user/favorites/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const favoritesList = favoritesResponse.data;
                setIsFavorite(favoritesList.some(fav => fav.id.toString() === userId));

                setLoading(false);  // Hide loading indicator once data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data.');  // Display error message if data fetch fails
                setLoading(false);
            }
        };

        fetchUserData();  // Fetch user data and reviews on component mount
    }, [userId, token, navigate]);

    // Function to toggle the favorite status for the user
    const toggleFavorite = async () => {
        const loggedUserId = localStorage.getItem('userId');

        // Prevent users from favoriting themselves
        if (!loggedUserId || !userId || loggedUserId.toString() === userId.toString()) {
            alert('You cannot favorite yourself.');
            return;
        }

        try {
            const response = await axios.post(`/user/${userId}/toggle-favorite/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(response.data.message);  // Display success message
            setIsFavorite(!isFavorite);  // Toggle favorite status
            window.location.reload();  // Refresh page to update favorite status
        } catch (error) {
            console.error('Error favoriting user:', error);
            setError('Failed to update favorites.');
        }
    };

    // Render loading indicator if data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error message if an error occurred
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="d-flex flex-column align-items-center my-5">
            {/* User profile section */}
            <div className="d-flex align-items-center mb-4 mt-5">
                {user.profile_image && (
                    <img
                        src={user.profile_image}  // Display user's profile image if available
                        alt="User Profile"
                        className="rounded-circle"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
                    />
                )}
            </div>
            <h1>{user.username}</h1>
            <p>{user.biography ? user.biography : "Biography not available"}</p>

            {/* Favorite/Unfavorite button */}
            <button className="btn btn-primary btn-lg mt-3" onClick={toggleFavorite}>
                {isFavorite ? 'Not favorite' : 'Favorite'}
            </button>

            {/* User's reviews section */}
            <h2 className="mt-5">Reviews</h2>
            <ul className="list-unstyled">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <li key={review.id} className="mb-4 mt-5">
                            {/* Display review image if available */}
                            {review.img && (
                                <div className="d-flex justify-content-center mb-2 mt-5">
                                    <img
                                        src={review.img}
                                        alt={review.title}
                                        className="img-fluid"
                                        style={{ maxWidth: '200px', height: 'auto' }}
                                    />
                                </div>
                            )}
                            {/* Review details */}
                            <div className="text-center">
                                <h4>{review.title}</h4>
                                <p><strong>Author/Director:</strong> {review.author_director}</p>
                                <p>{review.content}</p>
                                <p><strong>Genre:</strong> {review.genre_name}</p>
                                <p><strong>Rating:</strong> {review.rating}/5</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No reviews found.</p>  // Message if the user has no reviews
                )}
            </ul>
        </div>
    );
};

export default UserReviewsList;

