import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
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
    setSidebarOpen(false);
    navigate('/');
  };

  const hideNavPaths = ['/business-login', '/business-signup', '/admin-login'];
  if (hideNavPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className="navigation">
        <div className="nav-left">
          <h2 className="nav-brand" onClick={() => navigate('/')}>📊 RateSmart</h2>
        </div>
        <div className="nav-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span className="hamburger-icon">&#9776;</span>
        </div>
      </nav>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="nav-brand" onClick={() => {navigate('/'); setSidebarOpen(false);}}>📊 RateSmart</h2>
          <span className="close-icon" onClick={() => setSidebarOpen(false)}>&times;</span>
        </div>
        <div className="sidebar-links">
          <button className="nav-btn" onClick={() => {navigate('/'); setSidebarOpen(false);}}>🏠 Home</button>
          <button className="nav-btn" onClick={() => {navigate('/search-page'); setSidebarOpen(false);}}>🔍 Search Businesses</button>
          <button className="nav-btn" onClick={() => {navigate('/review'); setSidebarOpen(false);}}>📝 Leave Review</button>
          {user ? (
            <>
              <span className="user-greeting">{userType === 'admin' ? '👑' : '🏢'} Welcome, {user.name}!</span>
              {userType === 'business' && (
                <>
                  <button className="nav-btn dashboard-btn" onClick={() => {navigate('/business-dashboard'); setSidebarOpen(false);}}>📊 Dashboard</button>
                  <button className="nav-btn profile-btn" onClick={() => {navigate('/Profile'); setSidebarOpen(false);}}>👤 Profile</button>
                </>
              )}
              {userType === 'admin' && (
                <button className="nav-btn dashboard-btn" onClick={() => {navigate('/admin-dashboard'); setSidebarOpen(false);}}>👑 Admin Panel</button>
              )}
              <button className="nav-btn logout-btn" onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : (
            <>
              <button className="nav-btn login-btn" onClick={() => {navigate('/business-login'); setSidebarOpen(false);}}>🔑 Business Login</button>
              <button className="nav-btn signup-btn" onClick={() => {navigate('/business-signup'); setSidebarOpen(false);}}>✨ Business Signup</button>
              <button className="nav-btn admin-btn" onClick={() => {navigate('/admin-login'); setSidebarOpen(false);}}>👑 Admin</button>
            </>
          )}
        </div>
      </aside>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Navigation;