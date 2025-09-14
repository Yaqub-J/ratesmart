// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://ratesmart.onrender.com/api' 
    : 'http://localhost:8000/api');

export default API_BASE_URL;