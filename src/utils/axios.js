import axios from 'axios';

// Set base URL for all API requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    // Add any common headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => {
    // Ensure data is always an array for certain endpoints
    if (response.config.url === '/api/businesses/') {
      return {
        ...response,
        data: Array.isArray(response.data) ? response.data : []
      };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axios;