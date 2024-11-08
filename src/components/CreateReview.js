import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/CreateReview_style.css';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from './Auth';

/**
 * CreateReview Component
 * 
 * This component allows users to create a new review. It includes form input for title, author/director,
 * content, genre, rating, and an optional image upload. It also validates the token and manages errors.
 */
const CreateReview = () => {
    // State variables for form inputs
    const [title, setTitle] = useState('');
    const [authorDirector, setAuthorDirector] = useState('');
    const [content, setReviewContent] = useState('');
    const [category, setCategory] = useState('');
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState('');
    const [rating, setRating] = useState('');
    const [img, setImg] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // useEffect to check if the token is valid on component mount
    useEffect(() => {
        if (!isTokenValid()) {
            navigate('/api/login/');
            return;
        }
        // Fetch categories and genres when the component mounts
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/categories/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [navigate]);

    // Fetch genres based on the selected category
    useEffect(() => {
        if (category) {
            const fetchGenres = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.get(`/categories/${category}/genres/`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setGenres(response.data);
                } catch (error) {
                    console.error('Error fetching genres:', error);
                }
            };

            fetchGenres();
        }
    }, [category]);

    /**
     * handleSubmit function
     * 
     * This function is triggered when the form is submitted. It gathers the form data,
     * performs validation, and sends a POST request to create a new review.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent default form submission behavior
        const token = localStorage.getItem('token');  // Retrieve the stored user token

        try {
            // Check if required fields are filled
            if (!title || !authorDirector || !content || !genre) {
                setError('Please fill in all required fields.');
                return;
            }

            // Prepare form data including optional image file
            const formData = new FormData();
            formData.append('title', title);
            formData.append('author_director', authorDirector);
            formData.append('content', content);
            formData.append('genre', genre);
            formData.append('rating', rating);
            if (img) {
                formData.append('img', img);
            }

            // Send POST request to create the review
            await axios.post('/reviews/create/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Add Authorization header with Bearer token
                    'Content-Type': 'multipart/form-data',
                },
            });

            // If the review is successfully created
            setSuccess('Review created successfully!');
            setError('');  // Clear any error messages
            // Reset form fields after successful submission
            setTitle('');
            setAuthorDirector('');
            setReviewContent('');
            setCategory('');
            setGenre('');
            setRating('');
            setImg(null);
            navigate('/');

        } catch (error) {
            // Handle errors during the review creation process
            setError('An error occurred while creating the review.');
            setSuccess('');

            // Log different error details based on where the error occurred
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }

            console.error('Full error object:', error);
        }
    };

    return (
        <div className="container mt-5 pt-3 text-center">
            <h2>Create a New Review</h2>

            {error && <div className="alert alert-danger">{error}</div>}  {/* Display error message if any */}
            {success && <div className="alert alert-success">{success}</div>}  {/* Display success message if any */}

            {/* Form for creating a new review */}
            <form onSubmit={handleSubmit} className="p-4 bg-light rounded mt-5">
                {/* Title input field */}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Author/Director input field */}
                <div className="mb-3">
                    <label htmlFor="author_director" className="form-label">Author/Director</label>
                    <input
                        type="text"
                        className="form-control"
                        id="author_director"
                        value={authorDirector}
                        onChange={(e) => setAuthorDirector(e.target.value)}
                        required
                    />
                </div>

                {/* Review content (textarea) */}
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Review</label>
                    <textarea
                        className="form-control"
                        id="content"
                        rows="4"
                        value={content}
                        onChange={(e) => setReviewContent(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Select Category */}
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        className="form-control"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Genre */}
                <div className="mb-3">
                    <label htmlFor="genre" className="form-label">Genre</label>
                    <select
                        className="form-control"
                        id="genre"
                        value={genre}
                        onChange={(e) => setGenre(parseInt(e.target.value, 10))}
                        required
                    >
                        <option value="">Select a genre</option>
                        {genres.map((gen) => (
                            <option key={gen.id} value={gen.id}>
                                {gen.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rating input field */}
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="0"
                        max="5"
                        required
                    />
                </div>

                {/* Image upload field (optional) */}
                <div className="mb-3">
                    <label htmlFor="img" className="btn btn-primary">Upload an Image (optional)</label>
                    <div className="custom-file-upload">
                        <input
                            type="file"
                            className="file-input"
                            id="img"
                            onChange={(e) => setImg(e.target.files[0])}
                        />
                    </div>
                    {img && (
                        <div className="mt-2">
                            <small><strong>Selected file:</strong> {img.name}</small>
                        </div>
                    )}
                </div>

                {/* Submit button */}
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Submit Review</button>
                </div>
            </form>
        </div>
    );
};

export default CreateReview;
