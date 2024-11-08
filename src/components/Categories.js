import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../assets/css/Category_genre_filter.css";
import { isTokenValid } from './Auth';


/**
 * FilterReviews Component
 * 
 * This component displays a list of categories and their associated genres, allowing users to filter reviews by category or genre.
 * It includes functionality to toggle genre dropdown menus for each category and navigate to filtered review pages.
 */
const FilterReviews = () => {
  const [categories, setCategories] = useState([]); // Stores category data
  const [genresByCategory, setGenresByCategory] = useState({}); // Stores genres organized by category
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null); // Stores the ID of the currently open dropdown or null if none

  // Fetch categories and genres on component mount
  useEffect(() => {
    // Redirect to login if the token is invalid
    if (!isTokenValid()) {
      navigate('/api/login/');
      return;
    }

    const token = localStorage.getItem('token');

    // Async function to fetch categories and associated genres
    const fetchCategoriesAndGenres = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get('/categories/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const categoriesData = categoriesResponse.data;
        setCategories(categoriesData);

        // Fetch genres for each category
        const genresData = {};
        for (const category of categoriesData) {
          const genresResponse = await axios.get(`/categories/${category.id}/genres/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          genresData[category.id] = genresResponse.data;
        }
        setGenresByCategory(genresData);
      } catch (error) {
        console.error('Error fetching categories and genres:', error); // Log errors for debugging
      }
    };

    fetchCategoriesAndGenres();
  }, [navigate]);

  // Navigate to the category page
  const handleCategoryClick = (categoryId) => {
    navigate(`/reviews/category/${categoryId}`);
  };

  // Navigate to the genre page
  const handleGenreClick = (genreId) => {
    navigate(`/reviews/genre/${genreId}`);
  };

  // Toggle dropdown for genre list visibility
  const toggleDropdown = (categoryId) => {
    setDropdownOpen((prevOpenId) => (prevOpenId === categoryId ? null : categoryId));
  };

  return (
    <div className="border border-secondary rounded p-3 text-center bk-color">
      <h3>Categories</h3>
      <ul className="dropdown-list mt-3">
        {categories.map((category) => (
          <li key={category.id}>
            {/* Button to toggle dropdown for genres */}
            <button
              className="category-link mb-3"
              onClick={() => toggleDropdown(category.id)}
            >
              {category.name}
            </button>

            {/* Dropdown menu for genres */}
            {dropdownOpen === category.id && genresByCategory[category.id] && (
              <ul className="dropdown-menu show">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    All {category.name}
                  </button>
                </li>
                {genresByCategory[category.id].map((genre) => (
                  <li key={genre.id}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGenreClick(genre.id)}
                    >
                      {genre.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterReviews;


