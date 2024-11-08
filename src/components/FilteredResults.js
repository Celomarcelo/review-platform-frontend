import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { isTokenValid } from './Auth';

/**
 * FilteredReviews Component
 * 
 * This component displays a filtered list of reviews based on a selected category or genre.
 * It retrieves category and genre IDs from the URL parameters, makes an API request to 
 * fetch the filtered reviews, and displays them on the page.
 *
 */

const FilteredReviews = () => {
    const [reviews, setReviews] = useState([]);  // State to store filtered reviews
    const [error, setError] = useState(null);  // State for error messages
    const { categoryId, genreId } = useParams();  // Retrieve category and genre IDs from URL parameters
    const navigate = useNavigate();

    // Fetch reviews based on category or genre when component mounts or URL parameters change
    useEffect(() => {
        // Check if token is valid; if not, redirect to login
        if (!isTokenValid()) {
            navigate('/api/login/');
            return;
        }

        const token = localStorage.getItem('token');
        let apiUrl = '/reviews/';

        // Build the API endpoint based on whether category or genre is provided
        if (genreId) {
            apiUrl += `?genre=${genreId}`;
        } else if (categoryId) {
            apiUrl += `?category=${categoryId}`;
        }

        // Fetch filtered reviews from the API
        axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                setReviews(response.data);  // Update state with fetched reviews
            })
            .catch(error => {
                setError('Failed to load reviews.');  // Set error message if request fails
                console.error(error);
            });
    }, [categoryId, genreId, navigate]);

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <h2>Reviews</h2>
            {/* Display error message if there was an error during data fetching */}
            {error && <p>{error}</p>}

            {/* Display a message if no reviews are found */}
            {!error && reviews.length === 0 && (
                <p>No reviews found for the selected category or genre.</p>
            )}

            <ul>
                {/* Map through the reviews array and render each review */}
                {reviews.map(review => (
                    <li key={review.id} className="mt-5">
                        <div className="review-container" style={{ position: 'relative', margin: 'auto' }}>
                            {/* If the review has an image, display it */}
                            {review.img && (
                                <img
                                    src={review.img}
                                    alt={review.title}
                                    className="img-fluid"
                                    style={{ maxWidth: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
                                />
                            )}

                            {/* Display the user profile picture at the bottom-right corner of the review image */}
                            {review.user && review.user.profile_image && (
                                <Link to={`/user/${review.user.id}/reviewsList`}>
                                    <img
                                        src={review.user.profile_image}
                                        alt={review.user.username}
                                        className="profile-image"
                                        style={{
                                            position: 'absolute',
                                            bottom: '5px',
                                            right: '70px',
                                            width: '70px',
                                            height: '70px',
                                            borderRadius: '50%',
                                            border: '2px solid white',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Link>
                            )}
                        </div>
                        <div className='mt-3'>
                            {/* Link to the detailed review page */}
                            <Link to={`/reviews/${review.id}`}>{review.title}</Link> - {review.author_director}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FilteredReviews;



