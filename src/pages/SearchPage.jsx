import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import './SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (location) params.append('location', location);
      
      const { data } = await axios.get(`${API_BASE_URL}/businesses/search/?${params}`);
      setSearchResults(data);
      
      if (data.length === 0) {
        setError('No businesses found matching your search');
      }
    } catch (err) {
      console.error('Search error:', err.response);
      setError('Failed to search businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleBusinessSelect = (business) => {
    localStorage.setItem('business', JSON.stringify(business));
    localStorage.setItem('loggedInBusiness', JSON.stringify(business));
    navigate('/profile');
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
          placeholder="Search by business name or description..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          value={location}
          placeholder="Location (optional)..."
          onChange={handleLocationChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          <div className="business-list">
            {searchResults.map((business) => (
              <div 
                key={business.id} 
                className="business-card"
                onClick={() => handleBusinessSelect(business)}
              >
                <h4>{business.name}</h4>
                <p><strong>Location:</strong> {business.state}, {business.country}</p>
                <p><strong>Phone:</strong> {business.phone}</p>
                <p><strong>Hours:</strong> {business.hours}</p>
                {business.description && (
                  <p><strong>Description:</strong> {business.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;