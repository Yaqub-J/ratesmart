import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchBusiness, setSearchBusiness] = useState('');
  const [searchReview, setSearchReview] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchWithAuth = useCallback(
    async (url, setter) => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found 🚨');

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setter(res.data);
      } catch (err) {
        console.error(`Error fetching ${url}:`, err);
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/admin-login', { replace: true });
        } else {
          setError(`Could not load data from ${url} 🚨`);
        }
      }
    },
    [navigate]
  );

  const fetchBusinesses = useCallback(() => {
  return fetchWithAuth('/api/businesses/', setBusinesses);
  }, [fetchWithAuth]);

  const fetchReviews = useCallback(() => {
  return fetchWithAuth('/api/reviews/', setReviews);
  }, [fetchWithAuth]);

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([fetchBusinesses(), fetchReviews()]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data 🚨');
    } finally {
      setLoading(false);
    }
  }, [fetchBusinesses, fetchReviews]);


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
    } else {
      fetchData();
    }
  }, [navigate, fetchData]);

  const handleDeleteBusiness = async (id) => {
    if (window.confirm('Delete this business? 🚫')) {
      try {
  await axios.delete(`/api/businesses/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        fetchBusinesses();
      } catch (err) {
        console.error('Error deleting business:', err);
        setError('Failed to delete business. 🚨');
      }
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review? 🚫')) {
      try {
  await axios.delete(`/api/reviews/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        fetchReviews();
      } catch (err) {
        console.error('Error deleting review:', err);
        setError('Failed to delete review. 🚨');
      }
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset the entire system? This deletes all data. 🔄')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.post(
          '/api/admin/reset/',
          {},
          { headers: { Authorization: `Bearer ${token} `} }
        );
        fetchBusinesses();
        fetchReviews();
      } catch (err) {
        console.error('Error resetting system:', err);
        setError('Failed to reset. 🚨');
      }
    }
  };

  const filteredBusinesses = businesses.filter((b) =>
    b.name?.toLowerCase().includes(searchBusiness.toLowerCase())
  );

  const filteredReviews = reviews.filter((r) =>
    r.business_name?.toLowerCase().includes(searchReview.toLowerCase())
  );

  if (loading) return <div>Loading... 📊</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1 style={{ textAlign: 'center' }}>Admin Dashboard 📈</h1>
        <div className="admin-actions">
          <button onClick={handleReset}>🔄 Reset System</button>
          <button
            onClick={() => {
              localStorage.removeItem('access_token');
              navigate('/admin-login', { replace: true });
            }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div className="admin-tabs">
        <div
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Overview 📊
        </div>
        <div
          className={`tab ${selectedTab === 'businesses' ? 'active' : ''}`}
          onClick={() => setSelectedTab('businesses')}
        >
          Manage Businesses 🏢
        </div>
        <div
          className={`tab ${selectedTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reviews')}
        >
          Manage Reviews 📝
        </div>
      </div>

      <div className="tab-content">
        {selectedTab === 'overview' && (
          <div className="overview-cards">
            <div className="card">
              <h2>Total Registered Businesses 📈</h2>
              <p>{businesses.length}</p>
            </div>
          </div>
        )}

        {selectedTab === 'businesses' && (
          <div className="manage-section">
            <input
              type="text"
              placeholder="Search business... 🔍"
              value={searchBusiness}
              onChange={(e) => setSearchBusiness(e.target.value)}
            />
            <div className="business-cards">
              {filteredBusinesses.length === 0 ? (
                <p>No businesses found. 😞</p>
              ) : (
                filteredBusinesses.map((biz) => (
                  <div className="business-card" key={biz.id}>
                    <h3>{biz.name}</h3>
                    <p>Country: {biz.country}</p>
                    <p>State: {biz.state}</p>
                    <button onClick={() => handleDeleteBusiness(biz.id)}>Delete 🚫</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="manage-section">
            <input
              type="text"
              placeholder="Search by business... 🔍"
              value={searchReview}
              onChange={(e) => setSearchReview(e.target.value)}
            />
            <div className="review-cards">
              {filteredReviews.length === 0 ? (
                <p>No reviews found. 😞</p>
              ) : (
                filteredReviews.map((review) => (
                  <div className="review-card" key={review.id}>
                    <h3>{review.business_name}</h3>
                    <p>Product: {review.product_name || 'N/A'}</p>
                    <p>Customer: {review.customer_name}</p>
                    <p>Rating: {review.rating} ⭐</p>
                    <p>Review: {review.text}</p>
                    <p>Sentiment: {review.sentiment || 'N/A'} 😊</p>
                    <p>Fake? {review.is_fake ? 'Yes 🚩' : 'No'}</p>
                    <button onClick={() => handleDeleteReview(review.id)}>Delete 🚫</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;