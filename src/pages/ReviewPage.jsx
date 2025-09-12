import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReviewPage.css';

const ReviewPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/businesses/');
        setBusinesses(data);
      } catch (err) {
        console.error('Error fetching businesses:', err.response);
      }
    };
    fetchBusinesses();
  }, []);

  const handleBusinessSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredBusinesses([]);
    } else {
      const filtered = businesses.filter(b =>
        b.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    }
  };

  const handleBusinessSelect = async (business) => {
    setSelectedBusiness(business);
    try {
      const { data: allProducts } = await axios.get('http://localhost:8000/api/products/');
      const filtered = allProducts.filter(p => p.business === business.id);
      setProducts(filtered);
    } catch (err) {
      console.error('Error fetching products:', err.response);
    }
  };

  const handleSubmit = async () => {
    if (!customerName || !selectedProduct || !reviewText || !rating) {
      alert('Please complete all fields.');
      return;
    }

    try {
      const product = products.find(p => p.name === selectedProduct);
      await axios.post('http://localhost:8000/api/reviews/', {
        business_name: selectedBusiness.name,
        product: product.id,
        customer_name: customerName,
        text: reviewText,
        rating,
        sentiment: '',
        is_fake: false,
        reply: ''
      });

      navigate('/thank-you');
    } catch (err) {
      console.error('Error submitting review:', err.response);
      alert('Error submitting review. Please try again.');
    }
  };

  return (
    <div className="review-page">
      <h1>Leave a Review</h1>

      {!selectedBusiness && (
        <>
          <input
            type="text"
            placeholder="Search for a business..."
            value={searchTerm}
            onChange={handleBusinessSearch}
            className="search-input"
          />

          {searchTerm.trim() !== '' && filteredBusinesses.length > 0 && (
            <div className="business-list">
              {filteredBusinesses.map((b, index) => (
                <div
                  key={index}
                  className="business-item"
                  onClick={() => handleBusinessSelect(b)}
                >
                  <strong>{b.name}</strong> - {b.country}, {b.state}
                </div>
              ))}
            </div>
          )}
          {searchTerm.trim() !== '' && filteredBusinesses.length === 0 && (
            <p>No businesses found. 😞</p>
          )}
        </>
      )}

      {selectedBusiness && (
        <div className="review-form">
          <h2>Reviewing: {selectedBusiness.name}</h2>

          <table className="review-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Review</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                  />
                </td>
                <td>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">-- Select Product --</option>
                    {products.map((p, idx) => (
                      <option key={idx} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                  />
                </td>
                <td>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={star <= rating ? 'filled' : ''}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <button onClick={handleSubmit} className="submit-btn">Submit Review</button>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;