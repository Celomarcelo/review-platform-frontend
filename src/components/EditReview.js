import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isTokenValid } from './Auth';

/**
 * EditReview Component
 * 
 * This component allows users to edit an existing review. It fetches the review data using
 * the review ID from the URL, and provides form inputs for modifying the review fields.
 * It also includes functionality for image upload and form submission with error handling.
 */

const EditReview = () => {
    // Extract review ID from the route parameters
    const { reviewId } = useParams();

    // State for storing review data and form input values
    const [review, setReview] = useState({});
    const [form, setForm] = useState({
        title: '',
        content: '',
        genre: '',
        rating: '',
        img: null,
    });

    const [genres, setGenres] = useState([]);  // Stores genres associated with the review's category
    const [error, setError] = useState('');  // State to store error messages
    const navigate = useNavigate();  // Navigation hook for redirection
    const token = localStorage.getItem('token');  // Retrieve token from local storage

    // Fetch the review details from the server when the component is mounted
    useEffect(() => {
        // Check if the token is valid, if not, redirect to login page
        if (!isTokenValid()) {
            navigate('/api/login/');
            return;
        }

        // Fetch the review data from the server
        const fetchReview = async () => {
            try {
                const response = await axios.get(`/reviews/${reviewId}/`, {
                    headers: { Authorization: `Bearer ${token}` },  // Include the token in the request header
                });
                const reviewData = response.data;

                setReview(reviewData);  // Sets review data in the state
                setForm({
                    title: reviewData.title,
                    content: reviewData.content,
                    genre: reviewData.genre,
                    rating: reviewData.rating,
                    img: null,  // Image upload is optional and will not be fetched
                });

                // Fetches genres based on category ID if present
                const categoryId = reviewData.category_id;
                if (categoryId) {
                    const categoryResponse = await axios.get(`/categories/${categoryId}/genres/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setGenres(categoryResponse.data);  // Updates genres in state
                }
            } catch (error) {
                // Handle error in fetching the review details
                setError('An error occurred while fetching the review details.');
                console.error(error);
            }
        };

        fetchReview();
    }, [reviewId, token, navigate]);

    /**
     * handleInputChange
     * 
     * This function updates the form state when the user types in the form fields.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;  // Get the input name and value
        setForm({
            ...form,
            [name]: value,  // Update the corresponding form field in the state
        });
    };

    /**
     * handleImageChange
     * 
     * This function handles the change event when a user selects an image to upload.
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];  // Get the selected image file
        setForm({
            ...form,
            img: file,  // Update the img field in the form state
        });
    };

    /**
     * handleSave
     * 
     * This function is called when the user saves the edited review.
     * It sends a PUT request to update the review on the server.
     */
    const handleSave = async () => {
        // Create FormData to handle both text and file uploads
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('genre', form.genre);
        formData.append('rating', form.rating);

        if (form.img) {
            formData.append('img', form.img);  // If a new image was selected, append it
        }

        try {
            // Send PUT request to update the review
            await axios.put(`/reviews/${reviewId}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/profile');  // Redirect to the profile page after successful update
        } catch (error) {
            setError('An error occurred while saving the review.');
            console.error(error);
        }
    };

    /**
     * handleCancel
     * 
     * This function is called when the user cancels editing. It redirects to the profile page.
     */
    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <div className="d-flex flex-column align-items-center my-5">
            <div className="container my-5 text-center">
                {/* Display the current review title */}
                <h1>{review.title}</h1>
                {/* Display error message if there is one */}
                {error && <p className="text-danger">{error}</p>}

                {/* Title input field */}
                <div className="mb-3">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                {/* Content textarea field */}
                <div className="mb-3">
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{ height: '200px' }}
                    ></textarea>
                </div>

                {/* Genre input field */}
                <div className="mb-3">
                    <label>Genre</label>
                    <select
                        name="genre"
                        value={form.genre}
                        onChange={handleInputChange}
                        className="form-control"
                    >
                        <option value="">{review.genre_name || "Select a genre"}</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rating input field */}
                <div className="mb-3">
                    <label>Rating</label>
                    <input
                        type="number"
                        name="rating"
                        value={form.rating}
                        onChange={handleInputChange}
                        className="form-control"
                        min="0"
                        max="5"  // Limits rating input between 0 and 5
                    />
                </div>

                {/* Image upload field */}
                <div className="mb-3">
                    <label>Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="form-control"
                    />
                </div>

                {/* Save and Cancel buttons */}
                <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default EditReview;