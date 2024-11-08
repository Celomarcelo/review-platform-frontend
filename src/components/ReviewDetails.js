import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/ReviewDetails_style.css'
import { isTokenValid } from './Auth';

/**
 * ReviewDetails Component
 * 
 * This component fetches and displays the details of a review based on the review ID.
 * It retrieves the review ID from the URL parameters, makes an API request to 
 * fetch the review data, and then renders the details on the page.
 */
function ReviewDetails() {
    // Retrieve the reviewId from the URL using useParams
    const { reviewId } = useParams();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    /**
     * useEffect Hook
     * 
     * This hook is used to fetch the review details when the component mounts.
     */
    useEffect(() => {
        // Redirect to login if the token is invalid
        if (!isTokenValid()) {
            navigate('/api/login/');
            return;
        }
        const fetchReviewDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch review data from the API
                const response = await axios.get(`/reviews-details/${reviewId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Review data:", response.data);
                setReview(response.data);
                setLikes(response.data.likes || 0); // Initialize likes count
                setComments(response.data.comments || []); // Initialize comments
                setLoading(false);
            } catch (err) {
                console.error("Error fetching review details:", err);
                setError('Failed to load review details.');
                setLoading(false);
            }
        };

        fetchReviewDetails();
    }, [reviewId, navigate]);

    const handleLike = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`/reviews/${reviewId}/like/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLikes(response.data.likes); // Update likes count from response
            console.log("Likes:", likes);
        } catch (error) {
            console.error("Error liking review:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`/reviews/${reviewId}/comments/`,
                { content: newComment },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setComments([...comments, response.data]); // Add new comment to the list
            setNewComment(''); // Clear comment input
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/comments/${commentId}/delete/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="d-flex flex-column align-items-center pt-5 mt-5 mb-5">
            {/* Check if review data is available */}
            {review ? (
                <>
                    {/* Associated image */}
                    {review.img && (
                        <div className="my-4">
                            <img
                                src={review.img}
                                alt={review.title}
                                className="img-fluid"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                    )}
                    <h1>{review.title}</h1>
                    <p><strong>Author/Director:</strong> {review.author_director}</p>
                    <p><strong>Genre:</strong> {review.genre_name}</p>
                    <p><strong>Rating:</strong> {review.rating}/5</p>
                    <p>{review.content}</p>

                    {/* Like Button */}
                    <div>
                        <button onClick={handleLike} className="btn btn-primary">
                            👍 Like {likes}
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4">
                        <h3>Comments</h3>
                        <ul className="comment-list">
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <li key={comment.id}>
                                        <strong>{comment.user_name}:</strong> {comment.content}
                                        {comment.user_id === parseInt(userId) && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                style={{
                                                    marginLeft: '40px',
                                                    color: 'red',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </ul>


                        {/* Add new comment */}
                        <form onSubmit={handleCommentSubmit} className="mt-3">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="form-control"
                                placeholder="Add a comment..."
                            />
                            <button type="submit" className="btn btn-secondary mt-2">Post Comment</button>
                        </form>
                    </div>
                </>
            ) : (
                <p>Review not found.</p>
            )}
        </div>
    );
}

export default ReviewDetails;


