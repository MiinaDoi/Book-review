import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { clearToken } from '../slices/authSlice';
import './header.css';

const Header: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access the token from Redux to authenticate the API request
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    dispatch(clearToken());
    navigate('/login');
  };

  useEffect(() => {
    // Fetch user data from API when the token is available
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setName(data.name);  // Set the name from the API response
            setIconUrl(data.iconUrl); // Set the iconUrl from the API response
          } else {
            setError('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data');
        }
      }
    };

    fetchUserData();
  }, [token]);  // Dependency on token

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>BookReview.com</h1>
      </div>
      <div className="header-center">
        {token && <h2>Welcome, {name ? name : 'Loading...'}!</h2>} {/* Centered Welcome text */}
      </div>
      <div className="header-right">
        {token ? (
          <>
            <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
            {iconUrl && (
              <img
                src={iconUrl}
                alt="User Icon"
                onClick={handleProfileClick}
              />
            )}
          </>
        ) : (
          <button onClick={handleLoginClick} className="logout-button">Login</button>
        )}
        {error && <div className="error">{error}</div>} {/* Display error if fetching fails */}
      </div>
    </header>
  );
};

export default Header;
