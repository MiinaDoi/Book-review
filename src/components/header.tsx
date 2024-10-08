import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { clearToken } from '../slices/authSlice';

const Header: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
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

  return (
    <header>
      <div>
        {/* Conditional rendering based on login status */}
        {token ? (
          <div>
            <span>Welcome, {name ? name : 'Loading...'}!</span> {/* Display name or loading message */}
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLoginClick}>Login</button>
        )}
        {error && <div className="error">{error}</div>} {/* Display error if fetching fails */}
      </div>
    </header>
  );
};

export default Header;
