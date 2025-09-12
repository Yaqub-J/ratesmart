import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './BusinessDashboard.css';
import { useNavigate } from 'react-router-dom';

const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Please log in. 🚪');
          navigate('/business-login');
          return;
        }
        const headers = getAuthHeaders();
        const businessRes = await axios.get('http://localhost:8000/api/businesses/me/', headers);
        const productsRes = await axios.get('http://localhost:8000/api/products/', headers);
        const reviewsRes = await axios.get(`http://localhost:8000/api/reviews/?business_id=${businessRes.data.id}`, headers);

        setBusinessData(businessRes.data);
        setProducts(productsRes.data.filter(p => p.business === businessRes.data.id));
        setReviews(reviewsRes.data);
        localStorage.setItem('business', JSON.stringify(businessRes.data));
        localStorage.setItem('loggedInBusiness', JSON.stringify(businessRes.data));
      } catch (err) {
        console.error('Fetch data error:', err.response);
        setError('Failed to load dashboard 🚨');
        if (err.response?.status === 401) {
          navigate('/business-login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('business');
    localStorage.removeItem('loggedInBusiness');
    navigate('/business-login');
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/businesses/${businessData.id}/`,
        businessData,
        getAuthHeaders()
      );
      localStorage.setItem('business', JSON.stringify(businessData));
      localStorage.setItem('loggedInBusiness', JSON.stringify(businessData));
      alert('Business info updated successfully! 🎉');
    } catch (err) {
      console.error('Update error:', err.response);
      alert(err.response?.data?.message || 'Failed to update business info 🚨');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your business? 🚫')) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/businesses/${businessData.id}/`,
        getAuthHeaders()
      );
      handleLogout();
    } catch (err) {
      console.error('Delete error:', err.response);
      alert(err.response?.data?.message || 'Failed to delete business 🚨');
    }
  };

  const addProduct = async (name) => {
    try {
      const { data: newProd } = await axios.post(
        'http://localhost:8000/api/products/',
        { business: businessData.id, name },
        getAuthHeaders()
      );
      setProducts([...products, newProd]);
    } catch (err) {
      console.error('Add product error:', err.response);
      alert(err.response?.data?.message || 'Failed to add product 🚨');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}/`, getAuthHeaders());
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete product error:', err.response);
      alert(err.response?.data?.message || 'Failed to delete product 🚨');
    }
  };

  const handleReplyChange = (index, value) => {
    const updated = [...reviews];
    updated[index].reply = value;
    setReviews(updated);
  };

  const saveReplies = async () => {
    try {
      await Promise.all(
        reviews.map((r) =>
          axios.put(
            `http://localhost:8000/api/reviews/${r.id}/`,
            { reply: r.reply },
            getAuthHeaders()
          )
        )
      );
      alert('Replies saved successfully! 🎉');
    } catch (err) {
      console.error('Save replies error:', err.response);
      alert(err.response?.data?.message || 'Failed to save replies 🚨');
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const fakeCount = reviews.filter((r) => r.is_fake).length;
  const sentimentCounts = reviews.reduce(
    (acc, r) => {
      acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  if (loading) return <div className="loading-screen">Loading dashboard... 📊</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <h2>🧾</h2>
        </div>
        <ul className="sidebar-tabs">
          {['dashboard', 'products', 'reviews', 'preview', 'info'].map((tab) => (
            <li key={tab} onClick={() => toggleTab(tab)}>
              {tab === 'dashboard'
                ? '📊 Dashboard'
                : tab === 'products'
                ? '📦 Manage Products'
                : tab === 'reviews'
                ? '📝 Manage Reviews'
                : tab === 'preview'
                ? '👁 Preview Profile'
                : '⚙ Business Info'}
            </li>
          ))}
          <li onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header-bar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1>{businessData?.name || 'Business Dashboard'}</h1>
        </div>

        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="card">Total Reviews: {reviews.length} 📝</div>
            <div className="card">Avg Rating: ⭐ {averageRating}</div>
            <div className="card">Fake Reviews: 🚫 {fakeCount}</div>
            <div className="card">
              Sentiment: 😊 {sentimentCounts.positive} | 😐 {sentimentCounts.neutral} | ☹ {sentimentCounts.negative}
            </div>
            <div className="card">Total Products: 📦 {products.length}</div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="manage-section">
            <h2>Manage Products 📦</h2>
            <div className="side-by-side">
              <ProductForm onAdd={addProduct} />
              <table>
                <thead>
                  <tr>
                    <th>Name 📝</th>
                    <th>Action 🚀</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>
                          <button onClick={() => deleteProduct(p.id)}>Delete 🚫</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No products found. 😞</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="manage-section">
            <h2>Manage Reviews 📝</h2>
            <table>
              <thead>
                <tr>
                  <th>Customer 👤</th>
                  <th>Product 📦</th>
                  <th>Rating ⭐</th>
                  <th>Review 📝</th>
                  <th>Sentiment 😊</th>
                  <th>Fake? 🚩</th>
                  <th>Reply ↪</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length > 0 ? (
                  reviews.map((r, i) => (
                    <tr key={r.id}>
                      <td>{r.customer_name}</td>
                      <td>{r.product_name}</td>
                      <td>{r.rating}</td>
                      <td>{r.text}</td>
                      <td>
                        {r.sentiment === 'positive' && '😊 Positive'}
                        {r.sentiment === 'neutral' && '😐 Neutral'}
                        {!r.sentiment && 'N/A'}
                      </td>
                      <td>{r.is_fake ? 'Yes 🚩' : 'No'}</td>
                      <td>
                        <textarea
                          value={r.reply || ''}
                          onChange={(e) => handleReplyChange(i, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No reviews found. 😞</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="save-replies-btn" onClick={saveReplies}>
              💾 Save Replies
            </button>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="preview-profile">
            <h2>Profile Preview 👁</h2>
            <p>
              <strong>Name:</strong> {businessData?.name || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {businessData?.email || 'N/A'}
            </p>
            <p>
              <strong>Phone:</strong> {businessData?.phone || 'N/A'}
            </p>
            <p>
              <strong>Location:</strong> {businessData?.country || 'N/A'}, {businessData?.state || 'N/A'}
            </p>
            <p>
              <strong>Hours:</strong> {businessData?.hours || 'N/A'}
            </p>
            <p>
              <strong>Description:</strong> {businessData?.description || 'N/A'}
            </p>
            <h3>Products 📦</h3>
            <ul>
              {products.length > 0 ? (
                products.map((p) => <li key={p.id}>{p.name}</li>)
              ) : (
                <li>No products found. 😞</li>
              )}
            </ul>
            <h3>Reviews 📝</h3>
            <ul>
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <li key={r.id}>
                    <strong>{r.customer_name}</strong>: {r.text} ({r.sentiment})
                  </li>
                ))
              ) : (
                <li>No reviews found. 😞</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="manage-section">
            <h2>Business Info ⚙</h2>
            <div className="info-fields">
              {['name', 'email', 'phone', 'country', 'state', 'hours', 'description'].map((field) => (
                <React.Fragment key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {field === 'description' ? (
                    <textarea
                      value={businessData?.[field] || ''}
                      onChange={(e) => setBusinessData({ ...businessData, [field]: e.target.value })}
                    />
                  ) : (
                    <input
                      value={businessData?.[field] || ''}
                      onChange={(e) => setBusinessData({ ...businessData, [field]: e.target.value })}
                    />
                  )}
                </React.Fragment>
              ))}
              <div className="action-buttons">
                <button onClick={handleUpdate}>Save 💾</button>
                <button onClick={handleDelete} className="delete-btn">
                  Delete 🚫
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  return (
    <div className="product-form">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New product name 📝"
        required
      />
      <button
        onClick={() => {
          if (name.trim()) {
            onAdd(name.trim());
            setName('');
          }
        }}
      >
        Add ➕
      </button>
    </div>
  );
};

export default BusinessDashboard;