import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check what type of user is logged in
    const businessUser = localStorage.getItem('loggedInBusiness');
    const adminUser = localStorage.getItem('loggedInAdmin');
    const accessToken = localStorage.getItem('access_token');

    if (businessUser && accessToken) {
      setUser(JSON.parse(businessUser));
      setUserType('business');
    } else if (adminUser && accessToken) {
      setUser(JSON.parse(adminUser));
      setUserType('admin');
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('loggedInBusiness');
    localStorage.removeItem('loggedInAdmin');
    localStorage.removeItem('business');
    setUser(null);
    setUserType(null);
    navigate('/');
  };

  // Don't show navigation on login/signup pages
  const hideNavPaths = ['/business-login', '/business-signup', '/admin-login'];
  if (hideNavPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-left">
        <h2 className="nav-brand" onClick={() => navigate('/')}>
          📊 RateSmart
        </h2>
      </div>

      <div className="nav-center">
        <button 
          className="nav-btn" 
          onClick={() => navigate('/')}
        >
          🏠 Home
        </button>
        <button 
          className="nav-btn" 
          onClick={() => navigate('/search-page')}
        >
          🔍 Search Businesses
        </button>
        <button 
          className="nav-btn" 
          onClick={() => navigate('/review')}
        >
          📝 Leave Review
        </button>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="user-greeting">
              {userType === 'admin' ? '👑' : '🏢'} Welcome, {user.name}!
            </span>
            {userType === 'business' && (
              <>
                <button 
                  className="nav-btn dashboard-btn" 
                  onClick={() => navigate('/business-dashboard')}
                >
                  📊 Dashboard
                </button>
                <button 
                  className="nav-btn profile-btn" 
                  onClick={() => navigate('/Profile')}
                >
                  👤 Profile
                </button>
              </>
            )}
            {userType === 'admin' && (
              <button 
                className="nav-btn dashboard-btn" 
                onClick={() => navigate('/admin-dashboard')}
              >
                👑 Admin Panel
              </button>
            )}
            <button 
              className="nav-btn logout-btn" 
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <button 
              className="nav-btn login-btn" 
              onClick={() => navigate('/business-login')}
            >
              🔑 Business Login
            </button>
            <button 
              className="nav-btn signup-btn" 
              onClick={() => navigate('/business-signup')}
            >
              ✨ Business Signup
            </button>
            <button 
              className="nav-btn admin-btn" 
              onClick={() => navigate('/admin-login')}
            >
              👑 Admin
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;