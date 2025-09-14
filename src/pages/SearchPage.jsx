import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('/api/businesses/');
        // Ensure we're setting an array, even if empty
        setAllBusinesses(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Fetch businesses error:', err);
        setError('Failed to load businesses');
        setAllBusinesses([]); // Ensure we always have an array
        setTimeout(() => setError(''), 2000);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = () => {
    if (!Array.isArray(allBusinesses)) {
      setError('No businesses available');
      setTimeout(() => setError(''), 2000);
      return;
    }

    const match = allBusinesses.find(b =>
      b && b.name && b.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (match) {
      localStorage.setItem('business', JSON.stringify(match));
      localStorage.setItem('loggedInBusiness', JSON.stringify(match));
      navigate('/Profile');
    } else {
      setError('Business not found');
      setTimeout(() => setError(''), 2000);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!Array.isArray(allBusinesses)) {
      setSuggestions([]);
      return;
    }

    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const matches = allBusinesses.filter(b =>
      b && b.name && b.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches.slice(0, 5));
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="search-page">
      <h1 className="search-title">Search for a Business</h1>
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by business name..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((b, index) => (
            <li key={index} onClick={() => handleSuggestionClick(b.name)}>
              {b.name} — {b.country}, {b.state}
            </li>
          ))}
        </ul>
      )}

      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default SearchPage;